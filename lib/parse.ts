import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";


const parse = async (fileurl: string) => {
    try {
        // Parse the PDF file using PDFLoader
        console.log("Parsing PDF from URL:", fileurl);
        const response = await fetch(fileurl);

        if (!response.ok) {
            console.error("Failed to fetch PDF:", response.status, response.statusText);
            throw new Error(`Failed to fetch PDF: ${response.status} ${response.statusText}`);
        }

        const blob = await response.blob();
        console.log("PDF blob size:", blob.size, "type:", blob.type);

        const arrayBuffer = await blob.arrayBuffer();

        const loader = new PDFLoader(new Blob([arrayBuffer]));
        const documents = await loader.load();

        const text = documents.map((doc) => doc.pageContent).join("\n");
        console.log("Parsed PDF text length:", text.length, "characters");

        if (!text || text.trim().length === 0) {
            console.error("PDF parsing returned empty text");
            throw new Error("This PDF contains no extractable text. It may be a scanned document or image-based PDF. Please upload a text-based PDF where you can select and copy text.");
        }

        return text;
    } catch (error) {
        console.error("Error parsing PDF:", error);
        throw error;
    }
};

export default parse;
