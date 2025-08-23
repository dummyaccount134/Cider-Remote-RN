import { nowPlayingItem } from "@/lib/playback-control";
import { MediaItemArtwork } from "@/types/musickit";
import { FormatArtworkOptions, formatArtworkUrl } from "@/utils/artwork";
import { Image } from "expo-image";
import { useAtomValue } from "jotai";
import { useMemo } from "react";
import { ImageStyle, StyleSheet, View } from "react-native";

type ArtworkProps = {
    artwork: MediaItemArtwork
    options: Partial<FormatArtworkOptions>;
    style?: ImageStyle;
    mode?: 'none' | 'list-item' | 'page';
}

export function Artwork(props: ArtworkProps) {
    const nowPlaying = useAtomValue(nowPlayingItem);
    if (!nowPlaying) return null;

    const artworkUri = useMemo(() => {
        if (!nowPlaying.artwork) return;
        return formatArtworkUrl(props.artwork.url, props.options);
    }, [nowPlaying]);

    const modeStyle = useMemo(() => {
        switch (props.mode) {
            case 'list-item':
            return styles.listItemArtwork;
            case 'page':
            return styles.pageArtwork;
            default:
            return {};
        }
    }, [props.mode])

    return (
        <View style={props.style}>
            <Image
                source={{ uri: artworkUri }}
                style={[
                    {
                        width: '100%',
                        height: '100%',
                    },
                    modeStyle
                ]}
                contentFit="cover"
                transition={500}
                cachePolicy="memory-disk"
                recyclingKey={artworkUri}
                placeholderContentFit="cover"
            />
        </View>
    );
}

const styles = StyleSheet.create({
    listItemArtwork: {
        borderRadius: 3,
        overflow: 'hidden',
    },
    pageArtwork: {
        borderRadius: 12,
        overflow: 'hidden',
    }
})