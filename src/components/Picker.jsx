import {
  ImageList,
  ImageListItem,
  Popover,
  Button,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import { useState, useMemo } from "react";
import genshinCharacters from "../characters/genshin_impact.json";
import starRailCharacters from "../characters/honkai_star_rail.json";
import wuwaCharacters from "../characters/wuthering_waves.json";

// Merge all character arrays into one
const characters = [
  ...genshinCharacters,
  ...starRailCharacters,
  ...wuwaCharacters
];

export default function Picker({ setCharacter }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const [search, setSearch] = useState("");
  const [filterTag, setFilterTag] = useState("Genshin Impact");

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "picker" : undefined;

  const handleFilterChange = (event, newTag) => {
    if (newTag !== null) {
      setFilterTag(newTag);
    }
  };

  // Memoized filtering
  const memoizedImageListItems = useMemo(() => {
    const s = search.toLowerCase();
    return characters
      .filter((c) => c.tag === filterTag) // Apply tag filter
      .filter((c) =>
        s === c.id ||
        c.name.toLowerCase().includes(s) ||
        c.character.toLowerCase().includes(s)
      )
      .map((c) => {

        const newIndex = characters.findIndex((char) => char.id === c.id);

        return (<ImageListItem
          key={c.id}
          onClick={() => {
            handleClose();
            setCharacter(newIndex);
          }}
          sx={{
            cursor: "pointer",
            "&:hover": {
              opacity: 0.5,
            },
            "&:active": {
              opacity: 0.8,
            },
          }}
        >
          <img
            src={`${process.env.PUBLIC_URL}/img/${c.img}`}
            srcSet={`${process.env.PUBLIC_URL}/img/${c.img}`}
            alt={c.name}
            loading="lazy"
          />
        </ImageListItem>
      )
    });
  }, [search, setCharacter, filterTag]);

  return (
    <div>
      <Button
        aria-describedby={id}
        variant="contained"
        color="secondary"
        onClick={handleClick}
      >
        Pick character
      </Button>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        className="modal"
        sx={{ maxWidth: 560 }}
      >
        {/* Scrollable Tag Selection */}
        <div
          style={{
            display: "flex",
            overflowX: "auto",
            overflowY: "hidden",
            whiteSpace: "nowrap",
            padding: "10px",
            gap: "10px",
            scrollbarWidth: "none", // Hide scrollbar for Firefox
            msOverflowStyle: "none", // Hide scrollbar for IE/Edge
          }}
          onWheel={(e) => {
            //e.preventDefault(); // Prevent unwanted default scroll behavior
            e.currentTarget.scrollBy({
              left: e.deltaY * 2, // Adjust sensitivity (higher = faster)
              behavior: "smooth", // Enable smooth scrolling effect
            });
          }}
        >
          <ToggleButtonGroup
            value={filterTag}
            exclusive
            onChange={handleFilterChange}
            aria-label="Game Filter"
            sx={{
              display: "flex",
              flexWrap: "nowrap", // Ensure buttons are in a single row
            }}
          >
            <ToggleButton value="Genshin Impact">Genshin Impact</ToggleButton>
            <ToggleButton value="Honkai: Star Rail">Honkai: Star Rail</ToggleButton>
            <ToggleButton value="Zenless Zone Zero">Zenless Zone Zero</ToggleButton>
            <ToggleButton value="Arknights">Arknights</ToggleButton>
            <ToggleButton value="Wuthering Waves">Wuthering Waves</ToggleButton>
            <ToggleButton value="Others">Others</ToggleButton>
          </ToggleButtonGroup>
        </div>
        <div className="picker-search">
          <TextField
            label="Search character"
            size="small"
            color="secondary"
            value={search}
            fullWidth
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="image-grid-wrapper">
          <ImageList
            sx={{
              width: window.innerWidth < 600 ? 300 : 500,
              height: 450,
              overflow: "visible",
            }}
            cols={window.innerWidth < 600 ? 3 : 4}
            rowHeight={140}
            className="image-grid"
          >
            {memoizedImageListItems}
          </ImageList>
        </div>
      </Popover>
    </div>
  );
}
