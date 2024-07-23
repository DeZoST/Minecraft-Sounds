import { useState, useEffect, useCallback } from "react";
import { Box, Container, Heading } from "@chakra-ui/react";
import InfiniteScroll from "react-infinite-scroll-component";
import { debounce } from "lodash";
import SoundList from "./components/SoundList";
import SearchBar from "./components/SearchBar";
import sounds from "./data/processed_sounds.json";

function App() {
  const [searchTerm, setSearchTerm] = useState("");
  const [displayedSounds, setDisplayedSounds] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const itemsPerPage = 12;

  const filterSounds = (term) => {
    return sounds.filter(
      (sound) =>
        sound.name.toLowerCase().includes(term.toLowerCase()) ||
        sound.tags.some((tag) => tag.includes(term.toLowerCase()))
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

  return (
    <Container maxW="container.xl">
      <Box textAlign="center" my={5}>
        <Heading as="h1" size="xl">
          Minecraft Sound Library
        </Heading>
        <SearchBar setSearchTerm={setSearchTerm} />
        <InfiniteScroll
          dataLength={displayedSounds.length}
          next={fetchMoreData}
          hasMore={hasMore}
          loader={<h4>Loading...</h4>}
          endMessage={<p>You have seen all the sounds</p>}
        >
          <SoundList sounds={displayedSounds} />
        </InfiniteScroll>
      </Box>
    </Container>
  );
}

export default App;
