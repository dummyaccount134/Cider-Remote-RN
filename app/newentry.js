import { nextTrack, playPause, previousTrack, seekTo, UpdateNotification } from '@/lib/playback-control';
import 'expo-router/entry';
import MusicControl, { Command } from "react-native-music-control";

  MusicControl.enableBackgroundMode(true);

  MusicControl.handleAudioInterruptions(false);

  MusicControl.enableControl("play", true);
  MusicControl.enableControl("pause", true);
  MusicControl.enableControl("nextTrack", true);
  MusicControl.enableControl("previousTrack", true);

  // Changing track position on lockscreen
  MusicControl.enableControl("changePlaybackPosition", true);
  MusicControl.enableControl("seek", true);
  MusicControl.on(Command.play, ()=> {
    try {playPause(); UpdateNotification(null)} catch (e) {console.error(e)}})
  MusicControl.on(Command.pause, ()=> {
    try {playPause(); UpdateNotification(null)} catch (e) {console.error(e)}})
  MusicControl.on(Command.nextTrack, ()=> {
    try {nextTrack(); UpdateNotification(null)} catch (e) {console.error(e)}})
  MusicControl.on(Command.previousTrack, ()=> {
    try {previousTrack(); UpdateNotification(null)} catch (e) {console.error(e)}})
  MusicControl.on(Command.seek, (pos)=> {
    try {
      seekTo(pos);
      MusicControl.updatePlayback({
          elapsedTime: pos,
      });
    } catch (e) {
      console.error(e);
    }
  });

