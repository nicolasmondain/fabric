import { homothetic, module } from '../@types/index';

export default {
  gethomothetic(imgw: number, imgh: number, incw: number, inch: number): homothetic {
    const h = {} as homothetic;

    if (imgw / imgh > incw / inch) {
      const newimgw = (incw * imgh) / inch;

      h.x = (imgw - newimgw) / 2.0;
      h.y = 0;
      h.w = newimgw;
      h.h = imgh;
      h.r = incw / imgw;
    } else if (imgw / imgh < incw / inch) {
      const newimgh = (imgw * inch) / incw;

      h.x = 0;
      h.y = (imgh - newimgh) / 2.0;
      h.w = imgw;
      h.h = newimgh;
      h.r = incw / imgw;
    } else {
      h.x = 0;
      h.y = 0;
      h.w = imgw;
      h.h = imgh;
      h.r = incw / imgw;
    }

    return h;
  },
} as module;
