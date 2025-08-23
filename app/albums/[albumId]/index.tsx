import { TrackList } from "@/components/TrackList";
import { v3 } from "@/lib/am-api";
import { interact } from "@/lib/interact";
import { getTracks } from "@/lib/tracks";
import { Album, ItemTypes, Song } from "@/types/search";
import { useRoute } from "@react-navigation/native";
import { useRouter } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { ScrollView, View } from "react-native";
import { Button, IconButton, Text } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

export default function AlbumPage() {
    const [tracks, setTracks] = useState<Song[]>([]);
    const [item, setItem] = useState<Album>();

    const route = useRoute();
    const router = useRouter();

    const id = useMemo(() => {
        return (route.params as { albumId: string }).albumId;
    }, [route])

    const href = useMemo(() => {
        return `/v1/catalog/us/albums/${id}`;
    }, [id])


    const getData = async () => {
        const res = await v3<{
            data: {
                data: Album[],
            }
        }>(href);
        setItem(res?.data.data[0]);
        if (!res?.data.data[0]?.id) return;
        const tracks = await getTracks(res?.data.data[0].href.split('?')[0] + '/tracks');
        setTracks(tracks);
    }

    useEffect(() => {
        getData();
    }, [])

    return (
        <ScrollView>
            <SafeAreaView>
                <View
                    style={{
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "center",
                        position: "relative",
                        height: 64,
                    }}
                >
                    <IconButton
                        icon="arrow-left"
                        onPress={() => router.back()}
                        style={{ position: "absolute", left: 0, zIndex: 1 }}
                    />
                    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>

                    </View>
                </View>

                {item && <View>
                    <View style={{
                        padding: 16,
                    }}>
                        <Text>Album ID: {id}</Text>
                        <Text>Album Name: {item?.attributes.name}</Text>

                        <Button
                            icon="play"
                            mode="contained"
                            onPress={() => {
                                if (item) {
                                    interact({
                                        item: item as ItemTypes,
                                        playItem: true,
                                    })
                                }
                            }}
                        >Play</Button>
                    </View>
                    <TrackList tracks={tracks} />
                </View>}
            </SafeAreaView>
        </ScrollView>
    );
}