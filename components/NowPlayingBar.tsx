import { isPlaying as isPlayingAtom, nowPlayingItem, playPause } from "@/lib/playback-control";
import { useRouter } from "expo-router";
import { useAtomValue } from "jotai";
import { GestureResponderEvent, StyleSheet, View } from "react-native";
import { IconButton, Text, TouchableRipple } from "react-native-paper";
import { Artwork } from "./Artwork";
import { ArtworkBlur } from "./ArtworkBlur";

export function NowPlayingBar() {

    const nowPlaying = useAtomValue(nowPlayingItem);
    const isPlaying = useAtomValue(isPlayingAtom);

    const router = useRouter()

    const handlePress = () => {
        router.push('/modals/now-playing');
    }

    const playPress = (e: GestureResponderEvent) => {
        e.stopPropagation();
        playPause();
    }

    return (
        nowPlaying && <View>
            <TouchableRipple onPress={handlePress}>
                <>
                    <ArtworkBlur />

                    <View style={{
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                        padding: 2,
                        paddingLeft: 18,
                        paddingRight: 18,
                        width: '100%',
                        gap: 16,
                    }}>
                        <Artwork
                            mode="list-item"
                            artwork={nowPlaying.artwork} style={{
                                width: 40,
                                height: 40,
                            }} options={{ width: 600, height: 600 }} />
                        <View style={styles.container}>
                            <Text variant="titleMedium" numberOfLines={1}>
                                {nowPlaying.name}
                            </Text>
                        </View>
                        <IconButton
                            icon={isPlaying ? "pause" : "play"}
                            size={24}
                            onPress={playPress}
                        />
                    </View>
                </>
            </TouchableRipple>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'flex-start',
        paddingHorizontal: 0,
        paddingVertical: 0,
        flex: 1,
    },

});