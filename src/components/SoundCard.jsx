import { useRef } from "react";
import {
  Box,
  Heading,
  Tag,
  TagLabel,
  Button,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
} from "@chakra-ui/react";
import PropTypes from "prop-types";

function SoundCard({ sound }) {
  const audioRef = useRef(null);

  const playSound = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play();
    }
  };

  const pauseSound = () => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
  };

  const handleVolumeChange = (value) => {
    if (audioRef.current) {
      audioRef.current.volume = value / 100;
    }
  };

  return (
    <Box borderWidth="1px" borderRadius="lg" overflow="hidden" p="6">
      <Heading as="h3" size="md">
        {sound.name}
      </Heading>
      <Box my="4">
        {sound.tags.map((tag, index) => (
          <Tag key={index} mr="2" mb="2" colorScheme="teal">
            <TagLabel>{tag}</TagLabel>
          </Tag>
        ))}
      </Box>
      <audio ref={audioRef} src={`sounds/${sound.file}.ogg`} />
      <Box display="flex" justifyContent="center" gap={2} mt="4">
        <Button onClick={playSound} colorScheme="teal">
          Play
        </Button>
        <Button onClick={pauseSound} colorScheme="teal" variant="outline">
          Pause
        </Button>
      </Box>
      <Box mt="4">
        <Heading as="h4" size="sm">
          Volume
        </Heading>
        <Slider
          defaultValue={50}
          min={0}
          max={100}
          onChange={handleVolumeChange}
        >
          <SliderTrack>
            <SliderFilledTrack />
          </SliderTrack>
          <SliderThumb />
        </Slider>
      </Box>
    </Box>
  );
}

SoundCard.propTypes = {
  sound: PropTypes.object.isRequired,
};

export default SoundCard;
