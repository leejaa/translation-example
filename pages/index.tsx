import type { NextPage } from "next";
import { useTranslation } from "react-i18next";

const Home: NextPage = () => {
  const { t } = useTranslation();
  return <div>{t("general/a-sheet")}</div>;
};

export default Home;
