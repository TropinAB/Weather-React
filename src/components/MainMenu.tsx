export function MainMenu({
  currentPage,
  onClick,
}: {
  currentPage: string;
  onClick: any;
}) {
  function MenuItem({ id, text }: { id: string; text: string }) {
    return (
      <button
        className={
          "menu-item border" + (currentPage === id ? " menu-item-active" : "")
        }
        onClick={() => onClick(id)}
      >
        {text}
      </button>
    );
  }

  return (
    <div className="menu">
      <MenuItem id="About" text="О приложении" />
      <MenuItem id="City" text="Погода в городах" />
    </div>
  );
}
