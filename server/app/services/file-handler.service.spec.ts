import { expect } from 'chai';
import * as fs from 'fs';
import * as inversify from 'inversify';
import { ObjectId } from 'mongodb';
import { Drawing } from '../../models/drawing';
import { FilePaths, FileTypes } from '../../models/enum';
import Types from '../types';
import { FileHandler } from './file-handler.service';

describe('File Handler', () => {

  let fileHandler: FileHandler;
  let container: inversify.Container;

  beforeEach(() => {
      container = new inversify.Container();
      container.bind(Types.FileHandler).to(FileHandler);
      fileHandler = container.get<FileHandler>(Types.FileHandler);
  });

  it('#saveDrawing() should save the drawing in the image-storage folder with the id as a name' , () => {
    const id = 'TestSaveDrawing';
    fileHandler.saveDrawing([id], 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAfQAAAH');
    const path = `${__dirname}${FilePaths.ImageStorage}${id}.${FileTypes.Png}`;
    expect(fs.existsSync(path)).to.equal(true);
    fileHandler.deleteDrawing(id);
  });

  it('if #saveDrawing() is called with multiple ids, it should save the first one if its not saved', () => {
    const id: string[] = ['Test1', 'Test2', 'Test3'];
    fileHandler.saveDrawing(id, 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAfQAAAH');
    const path1 = `${__dirname}${FilePaths.ImageStorage}${id[0]}.${FileTypes.Png}`;
    const path2 = `${__dirname}${FilePaths.ImageStorage}${id[1]}.${FileTypes.Png}`;
    const path3 = `${__dirname}${FilePaths.ImageStorage}${id[2]}.${FileTypes.Png}`;
    expect(fs.existsSync(path1) && !fs.existsSync(path2) && !fs.existsSync(path3)).to.equal(true);
    fileHandler.deleteDrawing(id[0]);
  });

  it('if #saveDrawing() is called with multiple ids, it should save the second one if the first one is saved', () => {
    const id: string[] = ['Test1', 'Test2', 'Test3'];
    fileHandler.saveDrawing(['Test1'], 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAfQAAAH');
    fileHandler.saveDrawing(id, 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAfQAAAH');
    const path1 = `${__dirname}${FilePaths.ImageStorage}${id[0]}.${FileTypes.Png}`;
    const path2 = `${__dirname}${FilePaths.ImageStorage}${id[1]}.${FileTypes.Png}`;
    const path3 = `${__dirname}${FilePaths.ImageStorage}${id[2]}.${FileTypes.Png}`;
    expect(fs.existsSync(path1) && fs.existsSync(path2) && !fs.existsSync(path3)).to.equal(true);
    fileHandler.deleteDrawing(id[0]);
    fileHandler.deleteDrawing(id[1]);
  });

  it('if #saveDrawing() is called with multiple ids, it should save the third one if the first and secone ones are saved', () => {
    const id = ['Test1', 'Test2', 'Test3'];
    fileHandler.saveDrawing(['Test1'], 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAfQAAAH');
    fileHandler.saveDrawing(['Test2'], 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAfQAAAH');
    fileHandler.saveDrawing(id, 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAfQAAAH');
    const path1 = `${__dirname}${FilePaths.ImageStorage}${id[0]}.${FileTypes.Png}`;
    const path2 = `${__dirname}${FilePaths.ImageStorage}${id[1]}.${FileTypes.Png}`;
    const path3 = `${__dirname}${FilePaths.ImageStorage}${id[2]}.${FileTypes.Png}`;
    expect(fs.existsSync(path1) && fs.existsSync(path2) && fs.existsSync(path3)).to.equal(true);
    fileHandler.deleteDrawing(id[0]);
    fileHandler.deleteDrawing(id[1]);
    fileHandler.deleteDrawing(id[2]);
  });

  it('#exportDrawing(png) should export the file as a png file', () => {
    fileHandler.exportDrawing('TestExport', 'png', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAfQAAAH');
    const path: string = __dirname.replace(FilePaths.ServerPath, `${FilePaths.LocalPath}TestExport.png`);
    expect(fs.existsSync(path)).to.equal(true);
    fs.unlinkSync(path);
  });

  it('#exportDrawing(jpeg) should export the file as a jpeg file', () => {
    fileHandler.exportDrawing('TestExport', 'jpeg', 'data:image/jpeg;base64,iVBORw0KGgoAAAANSUhEUgAAAfQAAAH');
    const path: string = __dirname.replace(FilePaths.ServerPath, `${FilePaths.LocalPath}TestExport.jpeg`);
    expect(fs.existsSync(path)).to.equal(true);
    fs.unlinkSync(path);
  });

  it('#exportDrawing(svg) should export the file as a svg file', () => {
    fileHandler.exportDrawing('TestExport', 'svg+xml', 'data:image/svg+xml;base64,iVBORw0KGgoAAAANSUhEUgAAAfQAAAH');
    const path: string = __dirname.replace(FilePaths.ServerPath, `${FilePaths.LocalPath}TestExport.svg`);
    expect(fs.existsSync(path)).to.equal(true);
    fs.unlinkSync(path);
  });

  it('#exportDrawingEmail(png) should export to be able to send the file by email as a svg file', async () => {
    const result = await fileHandler.exportDrawingEmail('name', 'png', 'data:image/svg+xml;base64,iVBORw0KGgoAAAANSUhEUgAAAfQAAAH');
    expect(result.name).to.equals(' name.png ');
    expect(result.stream.readable).to.equal(true);
  });

  it('#exportDrawingEmail(jpeg) should export to be able to send the file by email as a svg file', async () => {
    const result = await fileHandler.exportDrawingEmail('name', 'jpeg', 'data:image/svg+xml;base64,iVBORw0KGgoAAAANSUhEUgAAAfQAAAH');
    expect(result.name).to.equals(' name.jpeg ');
    expect(result.stream.readable).to.equal(true);
  });

  it('#exportDrawingEmail(svg) should export to be able to send the file by email as a svg file', async () => {
    const result = await fileHandler.exportDrawingEmail('name', 'svg+xml', 'data:image/svg+xml;base64,iVBORw0KGgoAAAANSUhEUgAAAfQAAAH');
    //console.log('ICIIITEE', result.)
    expect(result.name).to.equals(' name.svg ');
    expect(result.stream.readable).to.equal(true);
  });

  it('#deleteDrawing(id) should delete the drawing corresponding to the id in the server', () => {
    fileHandler.saveDrawing(['DrawingToDelete'], 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAfQAAAH');
    fileHandler.saveDrawing(['DrawingNotToDelete'], 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAfQAAAH');
    const path1 = `${__dirname}${FilePaths.ImageStorage}'DrawingToDelete.${FileTypes.Png}`;
    const path2 = `${__dirname}${FilePaths.ImageStorage}'DrawingNotToDelete.${FileTypes.Png}`;
    fileHandler.deleteDrawing('DrawingToDelete');
    expect(!fs.existsSync(path1) && fs.existsSync(path2));
    fileHandler.deleteDrawing('DrawingNotToDelete');
  });

  it('#checkAllDrawingsAreInServer() should return the two drawings that are in the server', () => {
    const drawing1 = new Drawing('Drawing1', [], 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAfQAAAH', [], 0, 0, []);
    const drawing2 = new Drawing('Drawing2', [], 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAfQAAAH', [], 0, 0, []);
    const drawing3 = new Drawing('Drawing3', [], 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAfQAAAH', [], 0, 0, []);
    drawing1._id = new ObjectId('5e87a0fea5c7ee33a0700000');
    drawing2._id = new ObjectId('5e87a7cb2f32b32ec0700000');
    drawing3._id = new ObjectId('5e87ab6d2f32b32ec0700000');
    fileHandler.saveDrawing([drawing1._id.toHexString()], drawing1.dataURL);
    fileHandler.saveDrawing([drawing2._id.toHexString()], drawing2.dataURL);
    const drawingsInServer: Drawing[] = fileHandler.checkAllDrawingsAreInServer([drawing1, drawing2, drawing3]);
    expect(drawingsInServer.includes(drawing1) && drawingsInServer.includes(drawing2) && !drawingsInServer.includes(drawing3));
    fileHandler.deleteDrawing(drawing1._id.toHexString());
    fileHandler.deleteDrawing(drawing2._id.toHexString());
  });

  it('#checkAllDrawingsAreInServer() should return the three drawings that are in the server', () => {
    const drawing1 = new Drawing('Drawing1', [], 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAfQAAAH', [], 0, 0, []);
    const drawing2 = new Drawing('Drawing2', [], 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAfQAAAH', [], 0, 0, []);
    const drawing3 = new Drawing('Drawing3', [], 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAfQAAAH', [], 0, 0, []);
    drawing1._id = new ObjectId('5e87a0fea5c7ee33a0700000');
    drawing2._id = new ObjectId('5e87a7cb2f32b32ec0700000');
    drawing3._id = new ObjectId('5e87ab6d2f32b32ec0700000');
    fileHandler.saveDrawing([drawing1._id.toHexString()], drawing1.dataURL);
    fileHandler.saveDrawing([drawing2._id.toHexString()], drawing2.dataURL);
    fileHandler.saveDrawing([drawing3._id.toHexString()], drawing3.dataURL);
    const drawingsInServer: Drawing[] = fileHandler.checkAllDrawingsAreInServer([drawing1, drawing2, drawing3]);
    expect(drawingsInServer.includes(drawing1) && drawingsInServer.includes(drawing2) && drawingsInServer.includes(drawing3));
    fileHandler.deleteDrawing(drawing1._id.toHexString());
    fileHandler.deleteDrawing(drawing2._id.toHexString());
    fileHandler.deleteDrawing(drawing3._id.toHexString());
  });

  it('#checkAllDrawingsAreInServer() should return none of the drawings since they are not in the server', () => {
    const drawing1 = new Drawing('Drawing1', [], 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAfQAAAH', [], 0, 0, []);
    const drawing2 = new Drawing('Drawing2', [], 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAfQAAAH', [], 0, 0, []);
    const drawing3 = new Drawing('Drawing3', [], 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAfQAAAH', [], 0, 0, []);
    drawing1._id = new ObjectId('5e87a0fea5c7ee33a0700000');
    drawing2._id = new ObjectId('5e87a7cb2f32b32ec0700000');
    drawing3._id = new ObjectId('5e87ab6d2f32b32ec0700000');
    const drawingsInServer: Drawing[] = fileHandler.checkAllDrawingsAreInServer([drawing1, drawing2, drawing3]);
    expect(!drawingsInServer.includes(drawing1) && !drawingsInServer.includes(drawing2) && !drawingsInServer.includes(drawing3));
  });


});
