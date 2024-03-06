import React, { useState } from "react";
import readXlsxFile from "read-excel-file";

function ExcelReader() {
  const [excelData, setExcelData] = useState([]);
  const [priceData, setPriceData] = useState([]);
  const [mcols, setMCols] = useState([]);
  const [isPrice, setIsPrice] = useState(0);

  const handleFileUpload = async (e) => {
    try {
      const file = e.target.files[0];

      // Specify the sheet name or index
      const sheetProduct = "Product"; // Change this to the name of your sheet
      const sheetPrice = "Price"; // Change this to the name of your sheet
      // Alternatively, you can use the sheet index (e.g., 0 for the first sheet)
      // const sheetIndex = 0;
      let mandatoryCols = [];
      let rows = await readXlsxFile(file, {
        sheet: sheetProduct /* or sheetIndex */,
      });
      let erows = [];
      rows.forEach((row, index) => {
        if (index > 0) {
          if (
            row
              .reduce((indices, value, index) => {
                if (value === null) {
                  indices.push(index);
                }
                return indices;
              }, [])
              .some((element) => mandatoryCols.includes(element))
          )
            erows.push(["Data error", index + 1, ...row]);
        } else {
          row.forEach((cell, index) => {
            if (cell.indexOf("*") > -1 || cell.indexOf("=>") > -1)
              mandatoryCols.push(index);
          });
          setMCols(mandatoryCols);
          erows.push(["Remarks", "Sr. No.", ...row]);
          console.log(mandatoryCols);
        }
      });
      setExcelData(erows);

      const prows = await readXlsxFile(file, {
        sheet: sheetPrice /* or sheetIndex */,
      });
      let perows = [];

      setPriceData(perows);
    } catch (error) {
      console.error("Error reading Excel file:", error);
    }
    // const file = e.target.files[0];
    // const workbook = new ExcelJS.Workbook();
    // await workbook.xlsx.load(file);

    // const worksheet = workbook.getWorksheet(1); // Assuming the first worksheet is of interest
    // const data = [];

    // worksheet.eachRow((row) => {
    //   data.push(row.values);
    // });

    // setExcelData(data);
    // const priceWorksheet = workbook.getWorksheet(2); // Assuming the first worksheet is of interest
    // const pData = [];

    // priceWorksheet.eachRow((row) => {
    //   pData.push(row.values);
    // });
    // console.log(pData.length);
    // setPriceData(pData);
  };
  const handleCheckbox = (e) => {
    console.log(e.target.checked);
    if (e.target.checked) {
      setIsPrice(1);
    } else {
      setIsPrice(0);
    }
  };

  return (
    <div>
      <p>My Price value{isPrice}</p>
      <input type="file" onChange={handleFileUpload} />
      <input type="checkbox" onChange={handleCheckbox} />
      isPrice
      <table border="2px">
        <tbody>
          {isPrice == 0
            ? excelData.map((row, index) => (
                <tr key={index}>
                  {row.map((cell, index) => (
                    <>
                      {index > 1 &&
                      mcols.includes(index - 2) &&
                      cell == null ? (
                        <td key={index} style={{ backgroundColor: "red" }}>
                          {cell}
                        </td>
                      ) : (
                        <td key={index}>{cell}</td>
                      )}
                    </>
                  ))}
                </tr>
              ))
            : priceData.map((row, index) => (
                <tr key={index}>
                  {row.map((cell, index) => (
                    <td key={index}>{cell}</td>
                  ))}
                </tr>
              ))}
        </tbody>
      </table>
    </div>
  );
}
export default ExcelReader;
