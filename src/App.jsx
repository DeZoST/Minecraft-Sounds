import { useState, useEffect, useCallback, useRef } from "react";
import {
    Box,
    Container,
    Heading,
    Slider,
    SliderTrack,
    SliderFilledTrack,
    SliderThumb,
    VStack,
} from "@chakra-ui/react";
import { debounce } from "lodash";
import { useInView } from "react-intersection-observer";
import SoundList from "./components/SoundList";
import SearchBar from "./components/SearchBar";
import sounds from "./data/processed_sounds.json";

function App() {
    const [searchTerm, setSearchTerm] = useState("");
    const [displayedSounds, setDisplayedSounds] = useState([]);
    const [hasMore, setHasMore] = useState(true);
    const [page, setPage] = useState(1);
    const itemsPerPage = 12;
    const [globalVolume, setGlobalVolume] = useState(50);
    const [playingSound, setPlayingSound] = useState(null);
    const audioRefs = useRef([]);
    const { ref, inView } = useInView();

    const filterSounds = (term) => {
        const terms = term.toLowerCase().split(" ");
        return sounds.filter((sound) =>
            terms.every(
                (t) =>
                    sound.name.toLowerCase().includes(t) ||
                    sound.tags.some((tag) => tag.includes(t))
            )
        );
    };

    const debouncedSearch = useCallback(
        debounce((term) => {
            const filteredSounds = filterSounds(term);
            setDisplayedSounds(filteredSounds.slice(0, itemsPerPage));
            setHasMore(filteredSounds.length > itemsPerPage);
            setPage(1);
        }, 300),
        []
    );

    useEffect(() => {
        debouncedSearch(searchTerm);
    }, [searchTerm, debouncedSearch]);

    const fetchMoreData = () => {
        const filteredSounds = filterSounds(searchTerm);
        const nextPage = page + 1;
        const newSounds = filteredSounds.slice(0, nextPage * itemsPerPage);

        setDisplayedSounds(newSounds);
        setHasMore(filteredSounds.length > newSounds.length);
        setPage(nextPage);
    };

    useEffect(() => {
        if (inView && hasMore) {
            fetchMoreData();
        }
    }, [inView, hasMore]);

    const stopAllSounds = () => {
        audioRefs.current.forEach((audio) => {
            if (audio) {
                audio.pause();
                audio.currentTime = 0;
            }
        });
    };

    const playSound = (index) => {
        stopAllSounds();
        setPlayingSound(index);
    };

    const handleGlobalVolumeChange = (value) => {
        setGlobalVolume(value);
        audioRefs.current.forEach((audio) => {
            if (audio) {
                audio.volume = value / 100;
            }
        });
    };

    return (
        <Container maxW="container.xl">
            <Box textAlign="center" my={5}>
                <VStack position="sticky" top={0} zIndex={999} bgColor="white">
                    <Heading as="h1" size="xl">
                        Minecraft Sound Library
                    </Heading>
                    <SearchBar setSearchTerm={setSearchTerm} />
                    <Heading as="h4" size="sm">
                        Volume Global
                    </Heading>
                    <Slider
                        w="80%"
                        value={globalVolume}
                        min={0}
                        max={100}
                        onChange={handleGlobalVolumeChange}
                        mb={10}
                    >
                        <SliderTrack>
                            <SliderFilledTrack />
                        </SliderTrack>
                        <SliderThumb />
                    </Slider>
                </VStack>
                <SoundList
                    sounds={displayedSounds}
                    stopAllSounds={stopAllSounds}
                    audioRefs={audioRefs}
                    globalVolume={globalVolume}
                    playingSound={playingSound}
                    playSound={playSound}
                />
                {hasMore && (
                    <div
                        ref={ref}
                        style={{ visibility: "hidden", height: "20px" }}
                    >
                        Loading more sounds...
                    </div>
                )}
            </Box>
        </Container>
    );
}

export default App;
