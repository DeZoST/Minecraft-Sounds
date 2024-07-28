import { useState, useEffect, useRef, memo } from "react";
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

const SoundCard = memo(({ sound, globalVolume, isPlaying, onPlay }) => {
    const [initialized, setInitialized] = useState(false);
    const [progress, setProgress] = useState(0);
    const [audioElement, setAudioElement] = useState(null);
    const [isPaused, setIsPaused] = useState(false);
    const intervalRef = useRef(null);
    const toast = useToast();

    useEffect(() => {
        if (isPlaying && audioElement) {
            audioElement.volume = globalVolume / 100;
        }
    }, [globalVolume, isPlaying, audioElement]);

    useEffect(() => {
        if (isPlaying) {
            playSound();
        } else {
            pauseSound();
        }
    }, [isPlaying]);

    const initialize = () => {
        if (!initialized) {
            setInitialized(true);
        }
        onPlay();
    };

    const playSound = () => {
        if (!audioElement) {
            const newAudioElement = new Audio(
                `http://localhost:3000/audio/${sound.file}.ogg`
            );
            newAudioElement.volume = globalVolume / 100;
            setAudioElement(newAudioElement);

            newAudioElement.play();
            onPlay(sound.id); // Use unique sound ID

            intervalRef.current = setInterval(() => {
                setProgress(
                    (newAudioElement.currentTime / newAudioElement.duration) *
                        100
                );
            }, 10);

            newAudioElement.addEventListener("ended", handleEnded);
        } else if (isPaused) {
            audioElement.play();
            setIsPaused(false);

            intervalRef.current = setInterval(() => {
                setProgress(
                    (audioElement.currentTime / audioElement.duration) * 100
                );
            }, 10);
        } else {
            audioElement.currentTime = 0;
            audioElement.play();

            intervalRef.current = setInterval(() => {
                setProgress(
                    (audioElement.currentTime / audioElement.duration) * 100
                );
            }, 10);
        }
    };

    const pauseSound = () => {
        if (audioElement) {
            audioElement.pause();
            setIsPaused(true);
            clearInterval(intervalRef.current);
        }
    };

    const handleEnded = () => {
        setProgress(0);
        clearInterval(intervalRef.current);
        setAudioElement(null);
        setIsPaused(false);
        setInitialized(false);
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
                <Button onClick={initialize} colorScheme="teal">
                    {isPlaying && !isPaused ? "Pause" : "Play"}
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
            {initialized && (
                <Box mt="4">
                    <Progress value={progress} size="sm" />
                </Box>
            )}
        </Box>
    );
});

SoundCard.displayName = "SoundCard";

SoundCard.propTypes = {
    sound: PropTypes.object.isRequired,
    globalVolume: PropTypes.number.isRequired,
    isPlaying: PropTypes.bool.isRequired,
    onPlay: PropTypes.func.isRequired,
};

export default SoundCard;
