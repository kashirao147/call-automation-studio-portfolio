from pathlib import Path

from pypdf import PdfReader


BOOKS = {
    "8601": Path(r"C:/Users/W T/Documents/aiprojects/AIVoiceAgentPortfolio/tmp_aiou/8601_book.pdf"),
    "8602": Path(r"C:/Users/W T/Documents/aiprojects/AIVoiceAgentPortfolio/tmp_aiou/8602_book.pdf"),
    "8603": Path(r"C:/Users/W T/Documents/aiprojects/AIVoiceAgentPortfolio/tmp_aiou/8603_book.pdf"),
}


def extract_book_text(course_code: str, pdf_path: Path, out_dir: Path) -> None:
    reader = PdfReader(str(pdf_path))
    lines: list[str] = []

    for page_no, page in enumerate(reader.pages, start=1):
        text = (page.extract_text() or "").replace("\x00", " ")
        lines.append(f"\n=== PAGE {page_no} ===\n")
        lines.append(text)

    target = out_dir / f"{course_code}_book.txt"
    target.write_text("\n".join(lines), encoding="utf-8")


def main() -> None:
    out_dir = Path(r"C:/Users/W T/Documents/aiprojects/AIVoiceAgentPortfolio/tmp_aiou/extracted")
    out_dir.mkdir(parents=True, exist_ok=True)

    for course_code, pdf_path in BOOKS.items():
        if pdf_path.exists():
            extract_book_text(course_code, pdf_path, out_dir)
            print(f"Extracted {course_code} -> {out_dir / f'{course_code}_book.txt'}")
        else:
            print(f"Missing PDF for {course_code}: {pdf_path}")


if __name__ == "__main__":
    main()
