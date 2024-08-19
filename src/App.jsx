import {
    Box,
    Container,
    Heading,
    Slider,
    SliderTrack,
    SliderFilledTrack,
    SliderThumb,
    VStack,
    Button,
    HStack,
    Text,
    Spinner,
    Skeleton,
    SimpleGrid,
    useColorModeValue
} from "@chakra-ui/react";
import { debounce } from "lodash";
import { ThemeProvider } from "./ThemeContext";
import ThemeToggle from "./components/ThemeToggle";
import SoundList from "./components/SoundList";
import SearchBar from "./components/SearchBar";
import React, { Suspense, useState, useEffect, useCallback } from 'react';

const fetchSounds = async (page, searchTerm, itemsPerPage) => {
    try {
        const response = await fetch(
            `https://minecraftsound.fr/api/sounds?page=${page}&limit=${itemsPerPage}&search=${searchTerm}`
        );
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching sounds: ", error);
        return { sounds: [], meta: { total: 0, pageCount: 0, currentPage: 1 } };
    }
};

function App() {
    const [searchTerm, setSearchTerm] = useState("");
    const [displayedSounds, setDisplayedSounds] = useState([]);
    const [page, setPage] = useState(1);
    const [pageCount, setPageCount] = useState(0);
    const [allSounds, setAllSounds] = useState([]);
    const itemsPerPage = 8;
    const [globalVolume, setGlobalVolume] = useState(50);
    const [sliderVolume, setSliderVolume] = useState(50);
    const [playingSound, setPlayingSound] = useState(null);
    const [playingSoundData, setPlayingSoundData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const startColor = useColorModeValue("skeleton.start", "skeleton.start");
    const endColor = useColorModeValue("skeleton.end", "skeleton.end");   

    // Debounced search handler
    const debouncedSearch = useCallback(
        debounce(async (term) => {
            if (term) {
                setIsLoading(true);
                const data = await fetchSounds(1, term, itemsPerPage);
                setDisplayedSounds(data.sounds);
                setPage(1);
                setPageCount(data.meta.pageCount);
                setIsLoading(false);
            }
        }, 300),
        []
    );

    // Initial fetch for all sounds
    useEffect(() => {
        const fetchAllSounds = async () => {
            setIsLoading(true);
            const data = await fetchSounds(1, "", itemsPerPage);
            setAllSounds(data.sounds);
            setDisplayedSounds(data.sounds); // Ensure initial sounds are set
            setPageCount(data.meta.pageCount);
            setIsLoading(false);
        };
        fetchAllSounds();
    }, []);

    // Effect for debounced search term change
    useEffect(() => {
        if (searchTerm) {
            debouncedSearch(searchTerm);
        }
        return () => {
            debouncedSearch.cancel();
        };
    }, [searchTerm, debouncedSearch]);

    const handlePageChange = async (newPage) => {
        setIsLoading(true);
        const data = await fetchSounds(newPage, searchTerm, itemsPerPage);
        setDisplayedSounds(data.sounds);
        setPage(newPage);
        setPageCount(data.meta.pageCount);
        setIsLoading(false);
    };

    const stopAllSounds = () => {
        if (playingSound) {
            playingSound.pause();
            playingSound.currentTime = 0;
            setPlayingSound(null);
            setPlayingSoundData(null);
        }
    };

    const playSound = (sound) => {
        stopAllSounds();
        const audioElement = new Audio(
            `https://minecraftsound.fr/audio/${sound.file}.ogg`
        );
        audioElement.volume = globalVolume / 100;

        audioElement.addEventListener("ended", () => {
            setPlayingSound(null);
            setPlayingSoundData(null);
        });

        audioElement.play();
        setPlayingSound(audioElement);
        setPlayingSoundData(sound);
    };

    const togglePlaySound = (sound) => {
        if (playingSoundData?.file === sound.file) {
            playingSound.paused ? playingSound.play() : playingSound.pause();
        } else {
            playSound(sound);
        }
    };

    const debouncedVolumeChange = useCallback(
        debounce((value) => {
            setGlobalVolume(value);
            if (playingSound) {
                playingSound.volume = value / 100;
            }
        }, 300),
        [playingSound]
    );

    useEffect(() => {
        return () => {
            debouncedVolumeChange.cancel();
        };
    }, [debouncedVolumeChange]);

    const handleSliderChange = (value) => {
        setSliderVolume(value);
        debouncedVolumeChange(value);
    };

    return (
        <ThemeProvider>
            <Container maxW="container.xl">
                <ThemeToggle />
                <Box textAlign="center" my={5}>
                    <VStack>
                        <Heading as="h1" size="xl">
                            Minecraft Sound Library
                        </Heading>
                        <SearchBar
                            data={allSounds}
                            setSearchTerm={setSearchTerm}
                        />
                        <Heading as="h2" size="sm">
                            Global Volume
                        </Heading>
                        <Slider
                            aria-label="Choose a value for the sound"
                            w="40%"
                            value={sliderVolume}
                            min={0}
                            max={100}
                            onChange={handleSliderChange}
                            mb={10}
                        >
                            <SliderTrack>
                                <SliderFilledTrack />
                            </SliderTrack>
                            <SliderThumb />
                        </Slider>
                    </VStack>
                    <Suspense fallback={<Spinner size="xl" mt={10} />}>
                        {!isLoading && (
                            <SoundList
                                sounds={displayedSounds}
                                globalVolume={globalVolume}
                                playingSound={playingSound}
                                playingSoundData={playingSoundData}
                                playSound={togglePlaySound}
                                stopAllSounds={stopAllSounds}
                            />
                        )}
                        {isLoading && (
                            <SimpleGrid columns={[1, 2]} spacing="40px">
                                {Array.from({ length: itemsPerPage }).map((_, index) => (
                                    <Skeleton key={index} startColor={startColor} endColor={endColor} height="177.6px" />
                                ))}
                            </SimpleGrid>
                        )}
                    </Suspense>
                    <HStack justifyContent="center" mt={5}>
                        <Button
                            onClick={() => handlePageChange(page - 1)}
                            isDisabled={page === 1 || isLoading}
                        >
                            Previous
                        </Button>
                        <Text>
                            {page} / {pageCount}
                        </Text>
                        <Button
                            onClick={() => handlePageChange(page + 1)}
                            isDisabled={page === pageCount || isLoading}
                        >
                            Next
                        </Button>
                    </HStack>
                </Box>
            </Container>
        </ThemeProvider>
    );
}

export default App;
