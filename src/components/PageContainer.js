import React from "react";
import { EditorState, RichUtils, AtomicBlockUtils } from "draft-js";
import Editor from "draft-js-plugins-editor";
import addLinkPlugin from "./plugins/addLinkPlugin";
import "../App.css";
import createHighlightPlugin from "./plugins/highlightPlugin";
import BlockStyleToolbar  , {  getBlockStyle} from "./blockStyles/BlockStyleToolbar";
import { mediaBlockRenderer } from "./entities/mediaBlockRenderer";

const highlightPlugin = createHighlightPlugin();

class PageContainer extends React.Component {
 
  constructor(props) {
    super(props);
    this.state = {
      editorState: EditorState.createEmpty()
    };
    this.plugins = [addLinkPlugin];
    this.plugins = [highlightPlugin];
  }
  onChange = editorState => {
    this.setState({
      editorState
    });
  };

  onAddLink = () => {
    const editorState = this.state.editorState;
    const selection = editorState.getSelection();
    const link = window.prompt("Cole o Link ");
    if (!link) {
      this.onChange(RichUtils.toggleLink(editorState, selection, null));
      return "handled";
    }
    const content = editorState.getCurrentContent();
    const contentWithEntity = content.createEntity("LINK", "MUTABLE", {
      url: link
    });
    const newEditorState = EditorState.push(
      editorState,
      contentWithEntity,
      "create-entity"
    );
    const entityKey = contentWithEntity.getLastCreatedEntityKey();
    this.onChange(RichUtils.toggleLink(newEditorState, selection, entityKey));
    return "handled";
  };

  onAddImage = e => {
    e.preventDefault();
    const editorState = this.state.editorState;
    const urlValue = window.prompt("Paste Image Link");
    const contentState = editorState.getCurrentContent();
    const contentStateWithEntity = contentState.createEntity(
      "image",
      "IMMUTABLE",
      { src: urlValue }
    );
    const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
    const newEditorState = EditorState.set(
      editorState,
      { currentContent: contentStateWithEntity },
      "create-entity"
    );
    this.setState(
      {
        editorState: AtomicBlockUtils.insertAtomicBlock(
          newEditorState,
          entityKey,
          " "
        )
      },      
    );
  };   

  handleKeyCommand = command => {
    const newState = RichUtils.handleKeyCommand(
      this.state.editorState,
      command
    );
    if (newState) {
      this.onChange(newState);
      return "handled";
    }
    return "not-handled";
  };

  onUnderlineClick = () => {
    this.onChange(
      RichUtils.toggleInlineStyle(this.state.editorState, "UNDERLINE")
    );
  };

  onBoldClick = () => {
    this.onChange(RichUtils.toggleInlineStyle(this.state.editorState, "BOLD"));
  };

  onItalicClick = () => {
    this.onChange(
      RichUtils.toggleInlineStyle(this.state.editorState, "ITALIC")
    );
  };

  onStrikeThroughClick = () => {
    this.onChange(
      RichUtils.toggleInlineStyle(this.state.editorState, "STRIKETHROUGH")
    );
  };

  onHighlight = () => {
    this.onChange(
      RichUtils.toggleInlineStyle(this.state.editorState, "HIGHLIGHT")
    );
  };

  onURLChange = e => this.setState({ urlValue: e.target.value });

  toggleBlockType = (blockType) => {
    this.onChange(RichUtils.toggleBlockType(this.state.editorState, blockType));
    };

  render() {
    return (
      <div className="editorContainer">
        <div className="toolbar">
          <BlockStyleToolbar
            editorState={this.state.editorState}
            onToggle={this.toggleBlockType}
          />          
            <button
              className="inline styleButton"
              id="underline"
              onClick={this.onUnderlineClick}
            >
              U
            </button>

            <button
              className="inline styleButton"
              id="bold"
              onClick={this.onBoldClick}
            >
              B
            </button>

            <button
              className="inline styleButton"
              id="italic"
              onClick={this.onItalicClick}
            >
              I
            </button>
            <button
              className="inline styleButton strikethrough"
              onClick={this.onStrikeThroughClick}
            >
              abc
            </button>

            <button className="highlight" onClick={this.onHighlight}>
              <span style={{ background: "yellow", padding: "0.3em" }}>H</span>
            </button>

            <button id="link_url" onClick={this.onAddLink} className="add-link">
              <i className="material-icons">Link</i>
            </button>

            <button className="inline styleButton" onClick={this.onAddImage}>
            <i className="material-icons"> Image </i>
          </button>
        </div>
        

        <div className="editors">
          <Editor
            blockRendererFn={mediaBlockRenderer}
            blockStyleFn={getBlockStyle}
            editorState={this.state.editorState}
            handleKeyCommand={this.handleKeyCommand}
            onChange={this.onChange}
            plugins={this.plugins}
          />
        </div>
      </div>
    );
  }
}

export default PageContainer;
