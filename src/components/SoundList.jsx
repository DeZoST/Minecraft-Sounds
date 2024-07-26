import PropTypes from "prop-types";
import { SimpleGrid } from "@chakra-ui/react";
import SoundCard from "./SoundCard";

function SoundList({
    sounds,
    stopAllSounds,
    audioRefs,
    globalVolume,
    playingSound,
    playSound,
}) {
    return (
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing="40px" mx="auto">
            {sounds.map((sound, index) => (
                <SoundCard
                    key={index}
                    sound={sound}
                    stopAllSounds={stopAllSounds}
                    audioRef={(el) => (audioRefs.current[index] = el)}
                    globalVolume={globalVolume}
                    isPlaying={playingSound === index}
                    onPlay={() => playSound(index)}
                />
            ))}
        </SimpleGrid>
    );
}

SoundList.propTypes = {
    sounds: PropTypes.array.isRequired,
    stopAllSounds: PropTypes.func.isRequired,
    audioRefs: PropTypes.object.isRequired,
    globalVolume: PropTypes.number.isRequired,
    playingSound: PropTypes.number,
    playSound: PropTypes.func.isRequired,
};

export default SoundList;
