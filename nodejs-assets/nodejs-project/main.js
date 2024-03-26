// Rename this sample file to main.js to use on your project.
// The main.js file will be overwritten in updates/reinstalls.

var rn_bridge = require('rn-bridge');
const {ZingMp3} = require('zingmp3-api-full');
const ColorThief = require('colorthief');

rn_bridge.channel.on('home', async () => {
  const data = await ZingMp3.getHome();
  rn_bridge.channel.post(
    'home',
    data.data.items.filter(e => e.sectionType === 'playlist'),
  );
});
rn_bridge.channel.on('getSong', async track => {
  const data = await ZingMp3.getSong(track.id);
  rn_bridge.channel.post('getSong', {
    data: data.data,
    track: track,
  });
});
rn_bridge.channel.on('getSongInfo', async id => {
  const data = await ZingMp3.getInfoSong(id);
  rn_bridge.channel.post('getSongInfo', data.data);
});
rn_bridge.channel.on('initSong', async id => {
  const data = await ZingMp3.getSong(id);
  rn_bridge.channel.post('initSong', data.data);
});
rn_bridge.channel.on('getDetailPlaylist', async id => {
  const data = await ZingMp3.getDetailPlaylist(id);
  rn_bridge.channel.post('getDetailPlaylist', data.data);
});
rn_bridge.channel.on('search', async keyword => {
  const data = await ZingMp3.search(keyword);
  rn_bridge.channel.post('search', data.data);
});
rn_bridge.channel.on('getListArtistSong', async data => {
  const {page, count, id} = JSON.parse(data);
  const result = await ZingMp3.getListArtistSong(id, page, count);
  rn_bridge.channel.post('getListArtistSong', result.data);
});
rn_bridge.channel.on('getArtist', async name => {
  const data = await ZingMp3.getArtist(name);
  rn_bridge.channel.post('getArtist', data.data);
});
rn_bridge.channel.on('getArtistBySongId', async songId => {
  const song = await ZingMp3.getInfoSong(songId);
  const artist = await ZingMp3.getArtist(song.data?.artists[0]?.alias);
  rn_bridge.channel.post('getArtistBySongId', artist.data);
});
rn_bridge.channel.on('charthome', async () => {
  const data = await ZingMp3.getChartHome();
  rn_bridge.channel.post('charthome', data.data);
});
rn_bridge.channel.on('getLyric', async songId => {
  if (!songId) return;
  const data = await ZingMp3.getLyric(songId);
  const dataLyric = data.data;
  let customLyr = [];
  dataLyric.sentences &&
    dataLyric.sentences.forEach((e, _) => {
      let lineLyric = '';
      let sTime = 0;
      let eTime = 0;
      e.words.forEach((element, index) => {
        if (index === 0) {
          sTime = element.startTime;
        }
        if (index === e.words.length - 1) {
          eTime = element.endTime;
        }
        lineLyric = lineLyric + element.data + ' ';
      });
      customLyr.push({
        startTime: sTime,
        endTime: eTime,
        data: lineLyric,
      });
    });
  rn_bridge.channel.post('getLyric', customLyr);
});

rn_bridge.channel.on('getColors', async imgSrc => {
  const rgbToHex = (r, g, b) =>
    '#' +
    [r, g, b]
      .map(x => {
        const hex = x.toString(16);
        return hex.length === 1 ? '0' + hex : hex;
      })
      .join('');
  ColorThief.getPalette(imgSrc, 5)
    .then(palete => {
      const hexPalete = palete.map(e => rgbToHex(...e));
      rn_bridge.channel.post('getColors', hexPalete);
    })
    .catch(e => {
      rn_bridge.channel.post('getColors', e);
    });
});
