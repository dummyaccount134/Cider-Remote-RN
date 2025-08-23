import { ArtworkBlur } from "@/components/ArtworkBlur";
import { NowPlayingView } from "@/components/NowPlayingView";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function NowPlayingModal() {
    return (
        <SafeAreaView style={{
            flex: 1
        }}>
            <ArtworkBlur />
            <View style={{
                padding: 16,
                flex: 1,
            }}>
                <NowPlayingView />

            </View>
        </SafeAreaView>
    )
}