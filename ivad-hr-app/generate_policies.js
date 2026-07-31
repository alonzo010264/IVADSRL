import * as fs from 'fs';
import { Document, Packer, Paragraph, TextRun, HeadingLevel, ImageRun, AlignmentType } from 'docx';

const createDoc = async () => {
    const logoBuffer = fs.readFileSync('public/logo.png');

    const doc = new Document({
        sections: [
            {
                properties: {},
                children: [
                    new Paragraph({
                        alignment: AlignmentType.CENTER,
                        children: [
                            new ImageRun({
                                data: logoBuffer,
                                transformation: {
                                    width: 150,
                                    height: 100,
                                },
                            }),
                        ],
                    }),
                    new Paragraph({
                        text: "Políticas y Normas de Uso - IVAD Connect",
                        heading: HeadingLevel.HEADING_1,
                        alignment: AlignmentType.CENTER,
                        spacing: { before: 400, after: 400 },
                    }),
                    new Paragraph({
                        children: [
                            new TextRun({
                                text: "1. Propósito de la Plataforma",
                                bold: true,
                                size: 28,
                            }),
                        ],
                        spacing: { before: 200, after: 100 },
                    }),
                    new Paragraph({
                        text: "IVAD Connect es la plataforma oficial de gestión del personal de IVAD Home & Goods S.R.L. Está diseñada para centralizar la información de nómina, facilitar la comunicación interna y optimizar la administración de recursos humanos.",
                        spacing: { after: 200 },
                    }),
                    new Paragraph({
                        children: [
                            new TextRun({
                                text: "2. Confidencialidad y Uso de Credenciales",
                                bold: true,
                                size: 28,
                            }),
                        ],
                        spacing: { before: 200, after: 100 },
                    }),
                    new Paragraph({
                        text: "El acceso a IVAD Connect es estrictamente personal e intransferible. Cada colaborador es el único responsable de la seguridad de sus credenciales (usuario y contraseña). Queda totalmente prohibido compartir el acceso con terceros, incluyendo otros compañeros de trabajo. La información financiera, salarial y organizativa disponible en el portal es de carácter estrictamente confidencial.",
                        spacing: { after: 200 },
                    }),
                    new Paragraph({
                        children: [
                            new TextRun({
                                text: "3. Responsabilidades y Normas de Uso",
                                bold: true,
                                size: 28,
                            }),
                        ],
                        spacing: { before: 200, after: 100 },
                    }),
                    new Paragraph({
                        text: "Para mantener un entorno seguro y ordenado, el colaborador se compromete a:",
                        spacing: { after: 100 },
                    }),
                    new Paragraph({
                        text: "• Revisar periódicamente sus volantes de pago y notificar cualquier anomalía de forma oportuna a la Administración.",
                        bullet: { level: 0 },
                    }),
                    new Paragraph({
                        text: "• Mantener actualizada su información de contacto (correo y teléfono) en el directorio de la empresa.",
                        bullet: { level: 0 },
                    }),
                    new Paragraph({
                        text: "• Utilizar el sistema exclusivamente para fines laborales y de gestión administrativa relacionada con su empleo en IVAD.",
                        bullet: { level: 0 },
                        spacing: { after: 200 },
                    }),
                    new Paragraph({
                        children: [
                            new TextRun({
                                text: "4. Gestión de Nómina y Documentos",
                                bold: true,
                                size: 28,
                            }),
                        ],
                        spacing: { before: 200, after: 100 },
                    }),
                    new Paragraph({
                        text: "Los comprobantes digitales emitidos a través de IVAD Connect, incluyendo el Sello de Agua oficial de la empresa, tienen total validez interna para evidenciar los depósitos realizados. Cualquier intento de alterar, falsificar o modificar estos documentos, ya sea digital o físicamente, será considerado una falta grave.",
                        spacing: { after: 200 },
                    }),
                    new Paragraph({
                        children: [
                            new TextRun({
                                text: "5. Suspensión y Cancelación de Cuenta",
                                bold: true,
                                size: 28,
                            }),
                        ],
                        spacing: { before: 200, after: 100 },
                    }),
                    new Paragraph({
                        text: "La empresa se reserva el derecho de suspender temporal o permanentemente el acceso a IVAD Connect de cualquier usuario. Las causales inmediatas de suspensión incluyen, pero no se limitan a:",
                        spacing: { after: 100 },
                    }),
                    new Paragraph({
                        text: "• Compartir credenciales de acceso con otras personas (dentro o fuera de la empresa).",
                        bullet: { level: 0 },
                    }),
                    new Paragraph({
                        text: "• Intento de suplantación de identidad o acceso a cuentas de otros colaboradores.",
                        bullet: { level: 0 },
                    }),
                    new Paragraph({
                        text: "• Divulgación no autorizada de información confidencial o salarios de terceros.",
                        bullet: { level: 0 },
                    }),
                    new Paragraph({
                        text: "• Modificación, falsificación o fraude con los volantes de pago u otros documentos generados en la plataforma.",
                        bullet: { level: 0 },
                    }),
                    new Paragraph({
                        text: "• Intento de hackeo, manipulación del sistema o explotación de fallas de seguridad en la plataforma.",
                        bullet: { level: 0 },
                        spacing: { after: 200 },
                    }),
                    new Paragraph({
                        text: "Nota: La suspensión de la cuenta por las violaciones mencionadas puede conllevar acciones disciplinarias severas, incluyendo la terminación del contrato laboral y acciones legales si corresponde.",
                        spacing: { after: 200 },
                    }),
                    new Paragraph({
                        children: [
                            new TextRun({
                                text: "6. Soporte Técnico",
                                bold: true,
                                size: 28,
                            }),
                        ],
                        spacing: { before: 200, after: 100 },
                    }),
                    new Paragraph({
                        text: "En caso de olvidar la contraseña o presentar problemas técnicos, el usuario deberá utilizar la opción de 'Recuperación de Contraseña', la cual enviará un código temporal de 6 dígitos a su correo electrónico oficial.",
                        spacing: { after: 400 },
                    }),
                    new Paragraph({
                        alignment: AlignmentType.CENTER,
                        children: [
                            new TextRun({
                                text: "© 2024 IVAD Home & Goods S.R.L. Todos los derechos reservados.",
                                color: "888888",
                                size: 20,
                            }),
                        ],
                    }),
                ],
            },
        ],
    });

    const buffer = await Packer.toBuffer(doc);
    fs.writeFileSync('C:/Users/Admin/OneDrive/Desktop/Politicas_IVAD_Connect_v2.docx', buffer);
    console.log("Documento generado con éxito en el Escritorio.");
};

createDoc().catch(console.error);
