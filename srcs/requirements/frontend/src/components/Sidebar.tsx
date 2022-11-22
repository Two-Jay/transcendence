import classNames from "classnames";
import { Sidebar as FlowbiteSidebar } from "flowbite-react";
import { FC, PropsWithChildren } from "react";
import { useSidebarContext } from "../context/SidebarContext";
import { useRecoilState } from "recoil";
import { collapsedSidebarState } from "../recoil/menuState";

const Sidebar: FC<PropsWithChildren<Record<string, unknown>>> = function ({
  children,
}) {
  const { isOpenOnSmallScreens: isSidebarOpenOnSmallScreens } =
    useSidebarContext();

    const [collapsedSidebar, _] = useRecoilState(collapsedSidebarState);


//    const [isOpen, setOpen] = useState(false);

/*
    function toggle() {
      setOpen(!isOpen);
    }
*/
  return (
    <div
      className={classNames(
        "fixed overflow-auto top-15 h-screen z-10 lg:sticky lg:!block",
        {
          hidden: !isSidebarOpenOnSmallScreens,
        }
      )}
    >
{/*
      <Button color="warning" onClick={toggle}>
        a
      </Button>
*/}
      <FlowbiteSidebar collapsed={collapsedSidebar}>{children}</FlowbiteSidebar>
    </div>
  );
};

export default Object.assign(Sidebar, { ...FlowbiteSidebar });
