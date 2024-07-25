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

function SoundCard({ sound, audioRef, globalVolume, isPlaying, onPlay }) {
    const [progress, setProgress] = useState(0);
    const audioElement = useRef(null);
    const intervalRef = useRef(null);
    const toast = useToast();

    useEffect(() => {
        if (audioElement.current) {
            audioElement.current.volume = globalVolume / 100;
        }
    }, [globalVolume]);

    const playSound = () => {
        if (audioElement.current) {
            onPlay();
            audioElement.current.currentTime = 0;
            audioElement.current.play();
            intervalRef.current = setInterval(() => {
                if (audioElement.current) {
                    const duration = audioElement.current.duration;
                    const currentTime = audioElement.current.currentTime;
                    setProgress((currentTime / duration) * 100);
                }
            }, 100);
        }
    };

    const pauseSound = () => {
        if (audioElement.current) {
            audioElement.current.pause();
            clearInterval(intervalRef.current);
        }
    };

    const handleEnded = () => {
        setProgress(0);
        clearInterval(intervalRef.current);
        if (audioRef) audioRef(null);
    };

    const handleDownload = () => {
        const link = document.createElement("a");
        link.href = audioElement.current.src;
        link.download = `${sound.name}.ogg`;
        link.click();
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
                {sound.tags.map((tag, index) => (
                    <Tag key={index} mr="2" mb="2" colorScheme="teal">
                        <TagLabel>{tag}</TagLabel>
                    </Tag>
                ))}
            </Box>
            <audio
                ref={(el) => {
                    audioElement.current = el;
                    if (audioRef) audioRef(el);
                }}
                src={`sounds/${sound.file}.ogg`}
                onEnded={handleEnded}
            />
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
