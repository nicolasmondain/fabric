#include <math.h>
#include <stdio.h>
#include <emscripten.h>

int applytothecurrenti(int i, int x, int y, int w, int h, int sw) {
	if ((w == 0) && (h == 0)) return 1;
	if ((i % 4) == 0) {
		int pixel = (int)(i / 4);
		int currentX = pixel % sw;
		int currentY = floor(pixel / sw);
		if ((currentX >= x) && (currentX <= x + w)) {
			if ((currentY >= y) && (currentY <= y + h)) return 1;
		}
	}
	return 0;
}

int cap(int in) {
	return (in > 0) ? (in < 255) ? in : 255 : 0;
}

EMSCRIPTEN_KEEPALIVE
void webassembly(uint8_t* d, int dl, uint8_t* d2, int d2l, int x, int y, int w, int h, int sw) {
	if (dl == d2l) {
		for (int i = 0; i < dl; i += 4) {
			if (applytothecurrenti(i, x, y, w, h, sw)){
				d[i]     = cap(d[i] + d2[i]);
				d[i + 1] = cap(d[i + 1] + d2[i + 1]);
				d[i + 2] = cap(d[i + 2] + d2[i + 2]);
			}
		}
	}
}
