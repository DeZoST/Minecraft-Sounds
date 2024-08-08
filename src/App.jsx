import { useState, useEffect, useCallback } from "react";
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
} from "@chakra-ui/react";
import { debounce } from "lodash";
import { ThemeProvider } from "./ThemeContext";
import ThemeToggle from "./components/ThemeToggle";
import SoundList from "./components/SoundList";
import SearchBar from "./components/SearchBar";

const fetchSounds = async (page, searchTerm, itemsPerPage) => {
    try {
        const response = await fetch(
            `http://localhost:3000/sounds?page=${page}&limit=${itemsPerPage}&search=${searchTerm}`
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

    const debouncedSearch = useCallback(
        debounce(async (term) => {
            const data = await fetchSounds(1, term, itemsPerPage);
            setDisplayedSounds(data.sounds);
            setPage(1);
            setPageCount(data.meta.pageCount);
        }, 300),
        []
    );

    useEffect(() => {
        const fetchAllSounds = async () => {
            const data = await fetchSounds(1, "", 1000); // Fetch a large number to cover all data
            setAllSounds(data.sounds);
        };
        fetchAllSounds();
    }, []);

    useEffect(() => {
        debouncedSearch(searchTerm);
        return () => {
            debouncedSearch.cancel();
        };
    }, [searchTerm, debouncedSearch]);

    const handlePageChange = async (newPage) => {
        const data = await fetchSounds(newPage, searchTerm, itemsPerPage);
        setDisplayedSounds(data.sounds);
        setPage(newPage);
        setPageCount(data.meta.pageCount);
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
            `http://localhost:3000/audio/${sound.file}.ogg`
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
                        <Heading as="h4" size="sm">
                            Global Volume
                        </Heading>
                        <Slider
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
                    <SoundList
                        sounds={displayedSounds}
                        globalVolume={globalVolume}
                        playingSound={playingSound}
                        playingSoundData={playingSoundData}
                        playSound={togglePlaySound}
                        stopAllSounds={stopAllSounds}
                    />
                    <HStack justifyContent="center" mt={5}>
                        <Button
                            onClick={() => handlePageChange(page - 1)}
                            isDisabled={page === 1}
                        >
                            Previous
                        </Button>
                        <Text>
                            {page} / {pageCount}
                        </Text>
                        <Button
                            onClick={() => handlePageChange(page + 1)}
                            isDisabled={page === pageCount}
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
