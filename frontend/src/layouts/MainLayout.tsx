import { motion } from "framer-motion";
import { useAppSelector } from "@toolkit/hook";

import Header from "./Header";
import Footer from "./Footer";
import TabBar from "./TabBar";
import Alert from "@components/Alert";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const isAlert = useAppSelector((state) => state.alert.isAlert);
  return (
    <>
      {/* 메인 영역 */}
      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <div className="col-center container mx-auto px-4 pt-20">
          {children}
        </div>
      </motion.main>

      {/* 레이아웃 요소 */}
      <Header />
      <Footer />
      <TabBar />

      {/* 알림창 */}
      {isAlert && <Alert />}
    </>
  );
}
