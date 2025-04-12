import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";


const parse = async (fileurl: string) => {
    // Parse the PDF file using PDFLoader
    const response = await fetch(fileurl);
    const blob = await response.blob();
    const arrayBuffer = await blob.arrayBuffer();

    const loader = new PDFLoader(new Blob([arrayBuffer]));
    const documents = await loader.load();

    return documents.map((doc) => doc.pageContent).join("\n");

};

export default parse;