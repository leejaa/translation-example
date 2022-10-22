import type { NextPage } from "next";
import { useTranslation } from "react-i18next";

const Home: NextPage = () => {
  const { t } = useTranslation();
  return <div>{t("테스트키")}</div>;
};

export default Home;
