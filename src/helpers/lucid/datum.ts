import { C, toHex } from "lucid-cardano";

interface Datum {
  datum: string | null;
  datumHash: string | null;
}

const convertDatum = (datum: C.Datum): Datum => {
  const data = datum.as_data();
  const hash = datum.as_data_hash();

  return {
    datum: data
      ? toHex(new Uint8Array(data.to_js_value().original_bytes))
      : null,
    datumHash: hash ? hash.to_hex() : null,
  };
};

export { convertDatum };
