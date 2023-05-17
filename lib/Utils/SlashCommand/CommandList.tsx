import { Component } from "react";
import style from "./Commands.Module.css";

type CommandItem = {
  name: string;
  description: string;
  image: string;
};

class CommandList extends Component<{
  items: CommandItem[];
  command: (item: any) => void;
}> {
  state = {
    selectedIndex: 0,
  };

  componentDidUpdate(oldProps: any) {
    if (this.props.items !== oldProps.items) {
      this.setState({
        selectedIndex: 0,
      });
    }
  }

  onKeyDown({ event }: { event: any }) {
    if (event.key === "ArrowUp") {
      this.upHandler();
      return true;
    }

    if (event.key === "ArrowDown") {
      this.downHandler();
      return true;
    }

    if (event.key === "Enter") {
      this.enterHandler();
      return true;
    }

    return false;
  }

  upHandler() {
    this.setState({
      selectedIndex:
        (this.state.selectedIndex + this.props.items.length - 1) %
        this.props.items.length,
    });
  }

  downHandler() {
    this.setState({
      selectedIndex: (this.state.selectedIndex + 1) % this.props.items.length,
    });
  }

  enterHandler() {
    this.selectItem(this.state.selectedIndex);
  }

  selectItem(index: number) {
    const item = this.props.items[index];

    if (item) {
      this.props.command(item);
    }
  }

  render() {
    const { items } = this.props;
    return (
      <div className={style.menu}>
        {items.map((item, index) => {
          return (
            <button
              className={`${style.item} ${
                index === this.state.selectedIndex ? style.selected : ""
              }`}
              key={index}
              onClick={() => this.selectItem(index)}
            >
              <img src={item.image} alt={item.name} className={style.image} />
              <div className={style.content}>
                <div className={style.name}>{item.name}</div>
                <div className={style.description}>{item.description}</div>
              </div>
            </button>
          );
        })}
      </div>
    );
  }
}

export default CommandList;
