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

    const fetchSounds = async (page, searchTerm) => {
        try {
            const response = await fetch(
                `http://localhost:3000/sounds?page=${page}&search=${searchTerm}`
            );
            const data = await response.json();
            return data;
        } catch (error) {
            console.error("Error fetching sounds : ", error);
            return [];
        }
    };

    const debouncedSearch = useCallback(
        debounce(async (term) => {
            const sounds = await fetchSounds(1, term);
            setDisplayedSounds(sounds);
            setHasMore(sounds.length === itemsPerPage);
            setPage(1);
        }, 300),
        [fetchSounds, setDisplayedSounds, setHasMore, setPage]
    );

    useEffect(() => {
        debouncedSearch(searchTerm);
    }, [searchTerm, debouncedSearch]);

    /*    const fetchMoreData = async () => {
        const nextPage = page + 1;
        const sounds = await fetchSounds(nextPage, searchTerm);

        setDisplayedSounds((prev) => [...prev, ...sounds]);
        setHasMore(sounds.length === itemsPerPage);
        setPage(nextPage);
    };

    useEffect(() => {
        if (inView && hasMore) {
            fetchMoreData();
        }
    }, [inView, hasMore]); */

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
                        w="40%"
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
