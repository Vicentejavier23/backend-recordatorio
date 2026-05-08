// src/services/parser.service.js
const pdfParse = require("pdf-parse")
const Tesseract = require("tesseract.js")
const sharp = require("sharp")
const Groq = require("groq-sdk")

const client = new Groq({ apiKey: process.env.GROQ_API_KEY })

const extraerTexto = async (file) => {
  const esPDF = file.mimetype === "application/pdf"

  if (esPDF) {
    const resultado = await pdfParse(file.buffer)
    return { texto: resultado.text, esImagen: false }
  } else {
    const imagenMejorada = await sharp(file.buffer)
      .rotate()
      .grayscale()
      .sharpen()
      .normalize()
      .toBuffer()

    const { data } = await Tesseract.recognize(imagenMejorada, "spa", {
      tessedit_pageseg_mode: "6",
    })
    return { texto: data.text, esImagen: true }
  }
}

const parsearConIA = async ({ texto }) => {
  const prompt = `Eres un extractor de horarios de trabajo.
Analiza el siguiente horario y extrae todos los turnos de trabajo.

El formato usa estas abreviaciones:
- E: = hora de entrada
- S: = hora de salida
- SC: = salida a colación (ignorar)
- EC: = entrada de colación (ignorar)
- Las fechas están en formato DD-MM-YY o DIA DD-MM-26

Retorna SOLO un array JSON válido, sin texto adicional, sin markdown:
[{ "fecha": "2026-05-04", "inicio": "09:00", "fin": "20:00", "tipo": "Tarde" }]

Reglas para el tipo:
- Si entrada es antes de las 10:00 → "Apertura"
- Si entrada es desde las 10:00 → "Tarde"

Texto del horario:
${texto}`

  const completion = await client.chat.completions.create({
    model: "meta-llama/llama-4-scout-17b-16e-instruct",
    temperature: 0,
    messages: [{ role: "user", content: prompt }],
  })

  const respuesta = completion.choices[0].message.content.trim()
  const limpio = respuesta
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim()

  return JSON.parse(limpio)
}

module.exports = { extraerTexto, parsearConIA }