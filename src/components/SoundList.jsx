import PropTypes from "prop-types";
import { SimpleGrid } from "@chakra-ui/react";
import SoundCard from "./SoundCard";

const SoundList = ({
    sounds,
    globalVolume,
    playingSound,
    playingSoundData,
    playSound,
    stopAllSounds,
}) => {
    return (
        <SimpleGrid columns={[1, 2]} spacing="40px">
            {sounds.map((sound) => (
                <SoundCard
                    key={sound.id}
                    sound={sound}
                    globalVolume={globalVolume}
                    playingSound={playingSound}
                    playingSoundData={playingSoundData}
                    playSound={playSound}
                    stopAllSounds={stopAllSounds}
                />
            ))}
        </SimpleGrid>
    );
};

SoundList.propTypes = {
    sounds: PropTypes.array.isRequired,
    globalVolume: PropTypes.number.isRequired,
    playingSound: PropTypes.object,
    playingSoundData: PropTypes.object,
    playSound: PropTypes.func,
    stopAllSounds: PropTypes.func,
};

export default SoundList;
