import type { PropsWithChildren } from "react";
import { createContext, useContext, useEffect, useState } from "react";

interface SidebarContextProps {
  isOpenOnSmallScreens: boolean;
  isPageWithSidebar: boolean;
  // eslint-disable-next-line no-unused-vars
  setOpenOnSmallScreens: (isOpen: boolean) => void;
}

const SidebarContext = createContext<SidebarContextProps>(undefined!);

export function SidebarProvider({
  children,
}: PropsWithChildren<Record<string, unknown>>) {
  const location = isBrowser() ? window.location.pathname : "/";
  const [isOpen, setOpen] = useState(false);

  // Close Sidebar on page change on mobile
  useEffect(() => {
    if (isSmallScreen()) {
      setOpen(false);
    }
  }, [location]);

  // 주석처리 이유 : 스몰스크린일 때 사이드바 확장 후 페이지 이동 불가능
  // (추측 : mousedown 이벤트와 사이드바 클릭 이벤트 중 모바일을 위한 mousedown이벤트가 먼저 적용되는 듯)
  // // Close Sidebar on mobile tap inside main content
  // useEffect(() => {
  //   function handleMobileTapInsideMain(event: MouseEvent) {
  //     const main = document.querySelector("main");
  //     const isClickInsideMain = main?.contains(event.target as Node);

  //     if (isSmallScreen() && isClickInsideMain) {
  //       setOpen(false);
  //     }
  //   }

  //   document.addEventListener("mousedown", handleMobileTapInsideMain);
  //   return () => {
  //     document.removeEventListener("mousedown", handleMobileTapInsideMain);
  //   };
  // }, []);

  return (
    <SidebarContext.Provider
      value={{
        isOpenOnSmallScreens: isOpen,
        isPageWithSidebar: true,
        setOpenOnSmallScreens: setOpen,
      }}
    >
      {children}
    </SidebarContext.Provider>
  );
}

function isBrowser(): boolean {
  return typeof window !== "undefined";
}

function isSmallScreen(): boolean {
  return isBrowser() && window.innerWidth < 768;
}

export function useSidebarContext(): SidebarContextProps {
  const context = useContext(SidebarContext);

  if (!context) {
    throw new Error(
      "useSidebarContext should be used within the SidebarContext provider!"
    );
  }

  return context;
}
