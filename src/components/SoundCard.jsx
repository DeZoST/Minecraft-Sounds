import { useState, useEffect, useRef } from "react";
import {
    Box,
    Heading,
    Tag,
    TagLabel,
    Button,
    Progress,
    IconButton,
    Tooltip,
    useToast,
} from "@chakra-ui/react";
import { DownloadIcon, CopyIcon } from "@chakra-ui/icons";
import PropTypes from "prop-types";

function SoundCard({ sound, globalVolume, isPlaying, onPlay }) {
    const [progress, setProgress] = useState(0);
    const [audioElement, setAudioElement] = useState(null);
    const intervalRef = useRef(null);
    const toast = useToast();

    useEffect(() => {
        if (audioElement) {
            audioElement.volume = globalVolume / 100;
        }
    }, [globalVolume]);

    const playSound = () => {
        if (!audioElement) {
            const newAudioElement = new Audio(
                `http://localhost:3000/audio/${sound.file}.ogg`
            );
            newAudioElement.volume = globalVolume / 100;
            setAudioElement(newAudioElement);

            newAudioElement.play();
            onPlay();
            intervalRef.current = setInterval(() => {
                const duration = newAudioElement.duration;
                const currentTime = newAudioElement.currentTime;
                setProgress((currentTime / duration) * 100);
            }, 10);

            newAudioElement.addEventListener("ended", handleEnded);
        } else {
            audioElement.currentTime = 0;
            audioElement.play();
            intervalRef.current = setInterval(() => {
                const duration = audioElement.duration;
                const currentTime = audioElement.currentTime;
                setProgress((currentTime / duration) * 100);
            }, 10);
        }
    };

    const pauseSound = () => {
        if (audioElement) {
            audioElement.pause();
            clearInterval(intervalRef.current);
            setProgress(0);
        }
    };

    const handleEnded = () => {
        setProgress(0);
        clearInterval(intervalRef.current);
        setAudioElement(null);
    };

    const handleDownload = () => {
        const link = document.createElement("a");
        link.href = `http://localhost:3000/audio/${sound.file}.ogg`;
        link.download = `${sound.name}.ogg`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleCopyPath = () => {
        navigator.clipboard.writeText(sound.file);
        toast({
            title: "Path copied to clipboard",
            description: sound.file,
            status: "success",
            duration: 3000,
            isClosable: true,
            position: "top-right",
        });
    };

    useEffect(() => {
        if (isPlaying) {
            playSound();
        } else {
            pauseSound();
        }
    }, [isPlaying]);

    return (
        <Box borderWidth="1px" borderRadius="lg" overflow="hidden" p="6">
            <Heading as="h3" size="md">
                {sound.name}
            </Heading>
            <Box my="4">
                {sound.tags.split(",").map((tag, index) => (
                    <Tag key={index} mr="2" mb="2" colorScheme="teal">
                        <TagLabel>{tag}</TagLabel>
                    </Tag>
                ))}
            </Box>
            <Box display="flex" justifyContent="center" gap={2} mt="4">
                <Button
                    onClick={isPlaying ? pauseSound : () => onPlay()}
                    colorScheme="teal"
                >
                    {isPlaying ? "Pause" : "Play"}
                </Button>
                <Tooltip label="Download">
                    <IconButton
                        icon={<DownloadIcon />}
                        onClick={handleDownload}
                    />
                </Tooltip>
                <Tooltip label="Copy Path">
                    <IconButton icon={<CopyIcon />} onClick={handleCopyPath} />
                </Tooltip>
            </Box>
            <Box mt="4">
                <Progress value={progress} size="sm" />
            </Box>
        </Box>
    );
}

SoundCard.propTypes = {
    sound: PropTypes.object.isRequired,
    stopAllSounds: PropTypes.func.isRequired,
    audioRef: PropTypes.func.isRequired,
    globalVolume: PropTypes.number.isRequired,
    isPlaying: PropTypes.bool.isRequired,
    onPlay: PropTypes.func.isRequired,
};

export default SoundCard;
