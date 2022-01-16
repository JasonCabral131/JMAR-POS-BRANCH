import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axiosInstance from "src/helpers/axios";
import { LoaderSpinner, toCapitalized } from "src/reusable";
import { Chart } from "react-google-charts";
import { CDataTable, CCollapse, CCardBody } from "@coreui/react";
import { AiOutlineDown, AiOutlineUp } from "react-icons/ai";
const TaxCollection = () => {
  const [loading, setLoading] = useState([]);
  const { taxid } = useParams();
  const [tax, setTax] = useState(null);
  const [remmitted, setRemmitted] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [details, setDetails] = useState([]);
  const getTaxInformation = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.post("/tax-remmitted-collection", {
        tax: taxid,
      });
      setLoading(false);
      if (res.status === 200) {
        setTax(res.data.tax);
        setRemmitted(res.data.Arrange);
        const element = document.querySelector("ol.breadcrumb > li.active");
        if (element) {
          element.innerHTML = toCapitalized(
            `${res.data.tax.tax} Collected Tax `
          );
        }
        const data = res.data.Arrange.slice(0)
          .reverse()
          .map((data) => {
            const amount =
              Math.round((data.amount + Number.EPSILON) * 100) / 100;
            return [data.date, amount];
          });
        setChartData([[res.data.tax.tax, "Collection"], ...data]);
      }
    } catch (e) {
      setLoading(false);
    }
  };

  const toggleDetails = (index) => {
    const position = details.indexOf(index);
    let newDetails = details.slice();
    if (position !== -1) {
      newDetails.splice(position, 1);
    } else {
      newDetails = [...details, index];
    }
    setDetails(newDetails);
  };
  useEffect(() => {
    getTaxInformation();
    // eslint-disable-next-line
  }, []);
  return (
    <div className="w-100">
      {loading ? (
        <LoaderSpinner height="400px" />
      ) : (
        <div className="w-100">
          <div className="card shadow p-2">
            {chartData.length > 1 ? (
              <Chart
                width="100%"
                height="400px"
                chartType="Bar"
                data={chartData}
                legendToggle
                options={{
                  // Material design options
                  chart: {
                    title: `${
                      tax
                        ? toCapitalized(`${tax.tax} Collected`)
                        : "Tax Collected"
                    } Tax`,
                  },
                  vAxis: {
                    title: `Collected Data`,
                  },
                  series: {
                    0: { curveType: "function" },
                  },
                }}
              />
            ) : null}
            <div className="w-100 mt-2">
              <CDataTable
                items={[...remmitted]}
                fields={taxFields}
                columnFilter={false}
                tableFilter={{ placeholder: "search" }}
                footer={false}
                itemsPerPageSelect={true}
                itemsPerPage={5}
                hover
                sorter
                pagination
                loading={loading}
                scopedSlots={{
                  show_details: (item, index) => (
                    <td>
                      <div className="d-flex justify-content-center">
                        {details.includes(index) ? (
                          <AiOutlineDown
                            onClick={() => {
                              toggleDetails(index);
                            }}
                            className="hover mt-1 ml-4"
                          />
                        ) : (
                          <AiOutlineUp
                            onClick={() => {
                              toggleDetails(index);
                            }}
                            className="hover mt-1 ml-4"
                          />
                        )}
                      </div>
                    </td>
                  ),

                  details: (item, index) => {
                    return (
                      <CCollapse show={details.includes(index)}>
                        <CCardBody className={"p-1"}>
                          <h4 className="ml-2">
                            {item.date + " List Of Sales"}
                          </h4>
                          <div className="card shadow p-2">
                            <CDataTable
                              items={[...item.product]}
                              fields={productField}
                              columnFilter={false}
                              tableFilter={{
                                placeholder: "product",
                              }}
                              footer={false}
                              itemsPerPageSelect={true}
                              itemsPerPage={10}
                              hover
                              sorter
                              pagination
                            />
                          </div>
                        </CCardBody>
                      </CCollapse>
                    );
                  },
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaxCollection;
const productField = [
  { key: "product", label: "Product" },
  { key: "taxCollected", label: `Tax Collected` },
];
const taxFields = [
  {
    key: "amount",
    label: "Amount",
  },
  {
    key: "recipient",
    label: "Recipient",
  },
  {
    key: "date",
    label: "Transaction Date",
  },
  {
    key: "show_details",
    label: "Details",
    _style: { width: "1%" },
  },
];
