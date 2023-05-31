import { motion } from "framer-motion";
import { useAppSelector } from "@toolkit/hook";

import Header from "./Header";
import Footer from "./Footer";
import Alert from "@components/Alert";

export default function DetailPageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const isAlert = useAppSelector((state) => state.alert.isAlert);
  return (
    <>
      {/* 메인 영역 */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <div className="ol-center container mx-auto px-0 pt-20 md:px-4">
          {children}
        </div>
      </motion.div>

      {/* 해더 영역 */}
      <Header />

      {/* 푸터 영역 */}
      <Footer />

      {/* Alert */}
      {isAlert && <Alert />}
    </>
  );
}
