import {
  getTileFrameById,
  TILE_RENDER_SIZE,
  TILESET_META,
} from "../data/tilesetMeta";

const SCALE_X = TILE_RENDER_SIZE / TILESET_META.tileWidth;
const SCALE_Y = TILE_RENDER_SIZE / TILESET_META.tileHeight;
const SCALED_W = TILESET_META.atlasWidth * SCALE_X;
const SCALED_H = TILESET_META.atlasHeight * SCALE_Y;

export default function Tile({ type, onClick, onContextMenu, title }) {
  const frame = getTileFrameById(type);

  const bgX = -(frame.x * SCALE_X);
  const bgY = -(frame.y * SCALE_Y);

  return (
    <div
      className="tile"
      onClick={onClick}
      onContextMenu={onContextMenu}
      title={title}
      style={{
        backgroundImage: `url('${TILESET_META.imagePath}')`,
        backgroundPosition: `${bgX}px ${bgY}px`,
        backgroundSize: `${SCALED_W}px ${SCALED_H}px`,
        width: `${TILE_RENDER_SIZE}px`,
        height: `${TILE_RENDER_SIZE}px`,
      }}
    />
  );
}