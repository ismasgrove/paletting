import { Schema, model } from "mongoose";

export interface Palette {
  tag: string,
  palette: Array<string>;
  count: number;
}

const paletteSchema = new Schema<Palette>(
  {
    tag: { type: String, required: true, unique: true },
    palette: {
      type: [{ type: String }], required: true,
      validate: (arr: Array<string>) => {
        return arr.every((col: string) => /^#[0-9A-F]{6}$/i.test(col))
      }
    },
    count: { type: Number, required: true, },
  },
  {
    timestamps: {
      createdAt: "createdAt",
    },
  },
);

export default model("Palette", paletteSchema, "Palettes");
