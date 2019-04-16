import fs from "fs";
import sharp from "sharp";
import { saveImage } from "strategies";
import { unableToProcessFile } from "authErrors";
import { mockRequest, mockResponse } from "../__mocks__/strategyhelpers";

const next = jest.fn();

const bmpfile = {
  originalname: "test.bmp",
  buffer: [104, 101, 108, 108, 111, 32, 98, 117, 102, 102, 101, 114],
};

const pngfile = {
  originalname: "test.png",
  buffer: [104, 101, 108, 108, 111, 32, 98, 117, 102, 102, 101, 114],
};

jest.mock("sharp", () => jest.fn());
const then = jest.fn();
const toFile = jest.fn(() => ({ then }));
const withoutEnlargement = jest.fn(() => ({ toFile }));
const max = jest.fn(() => ({ withoutEnlargement }));
const resize = jest.fn(() => ({ max }));
sharp.mockImplementation(() => ({ resize }));

describe("Sharp Middleware", () => {
  let res;
  beforeEach(() => {
    res = mockResponse();
  });

  it("handles file errors requests", async (done) => {
    const err = "That file extension is not accepted!";
    const req = mockRequest(null, { path: "fake/path/test.tiff" }, err);

    await saveImage(req, res, next);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ err });
    done();
  });

  it("handles missing file requests", async (done) => {
    const req = mockRequest();

    await saveImage(req, res, next);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ err: unableToProcessFile });
    done();
  });

  it("handles valid gif and bmp file requests", async (done) => {
    const req = mockRequest(null, bmpfile);

    await saveImage(req, res, next);
    expect(fs.writeFile).toHaveBeenCalledWith(
      expect.stringContaining(bmpfile.originalname),
      bmpfile.buffer,
      expect.any(Function),
    );
    done();
  });

  it("handles valid png and jpg file requests", async (done) => {
    const req = mockRequest(null, pngfile);

    await saveImage(req, res, next);
    expect(sharp).toHaveBeenCalledWith(pngfile.buffer);
    done();
  });
});
