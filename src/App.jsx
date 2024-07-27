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
    const itemsPerPage = 6;
    const [globalVolume, setGlobalVolume] = useState(50);
    const [playingSound, setPlayingSound] = useState(null);

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
        debouncedSearch(searchTerm);
    }, [searchTerm, debouncedSearch]);

    const handlePageChange = async (newPage) => {
        const data = await fetchSounds(newPage, searchTerm, itemsPerPage);
        setDisplayedSounds(data.sounds);
        setPage(newPage);
        setPageCount(data.meta.pageCount);
    };

    const stopAllSounds = () => {
        // Logic to stop all sounds
    };

    const playSound = (index) => {
        stopAllSounds();
        setPlayingSound(index);
    };

    const handleGlobalVolumeChange = (value) => {
        setGlobalVolume(value);
        // Logic to update global volume for all sounds
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
                        Global Volume
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
                    globalVolume={globalVolume}
                    playingSound={playingSound}
                    playSound={playSound}
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
    );
}

export default App;
