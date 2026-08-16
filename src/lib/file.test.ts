import { formatFileSize, getFileExtension } from "./file";

describe("getFileExtension", () => {
    it("파일명에 확장자가 있으면 대문자로 반환한다", () => {
        expect(getFileExtension("공지자료.pdf")).toBe("PDF");
    });

    it("파일명에 점이 여러 개면 마지막 확장자를 반환한다", () => {
        expect(getFileExtension("2026.08.공지자료.hwp")).toBe("HWP");
    });

    it("확장자가 없으면 FILE을 반환한다", () => {
        expect(getFileExtension("공지자료")).toBe("FILE");
    });
});

describe("formatFileSize", () => {
    it("1024바이트 미만이면 B 단위로 반환한다", () => {
        expect(formatFileSize(500)).toBe("500 B");
    });

    it("1024바이트 이상 1MB 미만이면 KB 단위로 반환한다", () => {
        expect(formatFileSize(2048)).toBe("2 KB");
    });

    it("1MB 이상이면 소수점 첫째자리까지 MB 단위로 반환한다", () => {
        expect(formatFileSize(1.5 * 1024 * 1024)).toBe("1.5 MB");
    });
});
