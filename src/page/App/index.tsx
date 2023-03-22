import React, { useState, useEffect, useRef } from 'react';
import './index.scss';
import OpenSVG from '../../asset/Open';
import ImageSVG from '../../asset/Image';
import PicSVG from '../../asset/Pic';
import ItalicSVG from '../../asset/ItalicSvg';
import BoldSVG from '../../asset/Bold';
import AlignLeft from '../../asset/AlignLeft';
import CenterSvg from '../../asset/Center';
import Right from '../../asset/Right';
import Justify from '../../asset/Justify';
import List from '../../asset/List';
import Underline from '../../asset/Underline';

interface IPropsEdit {
  cmd: string;
  arg?: string;
  name?: string;
  Icon?: React.ElementType;
}

// interface File extends Blob {
//   name: string;
// }

interface File extends Blob {
  readonly size: number;
  readonly type: string;
  readonly name: string;
  slice(start?: number, end?: number, contentType?: string): Blob;
}


const App = ()=>  {
  const ref = useRef<HTMLInputElement | null>(null);
  const [openDropdown, setOpenDropdown] = useState(false);
  const [modal, setModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState<Blob | null>()
  const [preview, setPreview] = useState<string>('')
  const [storeImage, setStoreImage] = useState<string[]>([]);
  const [html, setHtml] = useState<string>('');
  const [currentDropdown, setCurrentDropdown] = useState('image');
  const [url, setUrl] = useState<string>('');
  const [code, setCode] = useState('');
  const [changeValue, setChangeValue] = useState<string>('');
  const [wordList, setWordList] = useState<number>(0);
  const [contentEditable, setContentEditable] = useState<any>('true');
  const [htmlContent, setHtmlContent] = useState<string>('');
  const [titlePost, setTitlePost] = useState<string>('');
  const [showPost, setShowPost] = useState<boolean>(false);
  const [videoType, setVideoType] = useState<string>('youtube');
  const [fileName, setFileName] = useState<string>('');
  const [linkTitle, setLinkTitle] = useState<string>('Facebook');

  useEffect(() => {
    if (!selectedFile) {
        setPreview('')
        return
    };
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    setFileName(selectedFile['name']);
    const objectUrl = URL.createObjectURL(selectedFile)
    setPreview(objectUrl)
    return () => URL.revokeObjectURL(objectUrl)
  }, [selectedFile]);

  useEffect(() => {
    if(wordList === 1000) {
      setContentEditable('false');
    }
  },[wordList]);

  const EditButton = ({ cmd, arg, name, Icon }: IPropsEdit) => {
    return (
      <button
        key={cmd}
        className="app__edit-btn"
        onMouseDown={evt => {
          evt.preventDefault(); 
          document.execCommand(cmd, false, arg); 
        }}
      >
        {Icon && <Icon />}
        {name}
      </button>
    );
  }

  const onSelectFile = (e:  React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) {
        setSelectedFile(undefined)
        return
    }
    setSelectedFile(e.target.files[0])
  };

  const handleFocus = (valueType: string, insertType: string) => {
    if(ref.current !== null) {
      const length = ref.current.innerText.length;
      ref.current?.focus();
      if(!!ref.current?.lastChild){
        const sel = window.getSelection();
        if(sel !== null) {
          if(ref.current?.lastChild?.nodeValue === null) {
            sel.collapse(ref.current?.lastChild, 0);
            document.execCommand('insertHTML', false, '<br><br><br><br>');
            document.execCommand(insertType, false, valueType);
            document.execCommand('insertHTML', false, '<br><br>');
          } else {
            sel.collapse(ref.current?.lastChild, length);
            document.execCommand('insertHTML', false, '<br><br>');
            document.execCommand(insertType, false, valueType);
            document.execCommand('insertHTML', false, '<br><br>');
          }
        }
      }else {
        document.execCommand(insertType, false, valueType);
      }
    }
  }

  const handleEmbeImage = (evt: React.MouseEvent<HTMLButtonElement>) => {
    evt.preventDefault(); 
    setStoreImage([ ...storeImage, preview])
    setSelectedFile(undefined);
    setPreview('')
    setModal(false);
    setOpenDropdown(false);
    handleFocus(preview, 'insertImage');
  };

  const handleVideo = () => {
    if (videoType === 'youtube') {
      handleFocus(code, 'insertHTML');
      setCode('');
      setModal(false);
      setOpenDropdown(false);
    } else if (videoType === 'device'){
      const videoTag = `
        <h3>${fileName}</h3>
        <br>
        <video width="400" controls>
            <source src=${preview} type="video/mp4">
            Your browser does not support HTML video.
        </video>
      `
      handleFocus(videoTag, 'insertHTML');
      setCode('');
      setModal(false);
      setOpenDropdown(false);
      setSelectedFile(undefined);
      setPreview('')
    } else {
      const videoTag = `
      <h3>Video</h3>
        <br>  
      <video width="400" controls>
          <source src=${code} type="video/mp4">
          Your browser does not support HTML video.
      </video>` 
      handleFocus(videoTag, 'insertHTML');
      setCode('');
      setModal(false);
      setOpenDropdown(false);
    }
  };

  const handleCloseModal = () => {
    setSelectedFile(null); 
    setModal(false);
    setUrl('');
  };

  const handleEmbeSocial = () => {
    setModal(false);
    setOpenDropdown(false);
    const urlHtml =  `<a href=${url} target="_blank" contenteditable="false">${linkTitle}</a>`;
    handleFocus(urlHtml, 'insertHTML');
  };

  const handleUrlInput = (e: React.ChangeEvent<HTMLInputElement>) => setUrl(e.target.value);
  const handleCode = (e: React.ChangeEvent<HTMLInputElement>) => setCode(e.target.value);

  const handlePost = () => {
    if(ref.current !== null) {
      setHtmlContent(ref.current.outerHTML)
      setShowPost(true);
    }
  };

  const handleColor = (event: React.ChangeEvent<HTMLSelectElement>) => {
    document.execCommand('foreColor', false, event.target.value);
  };

  const handleFontSize = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setChangeValue(event.target.value)
    document.execCommand('fontSize', false, event.target.value);
  };

  const handleHeading = (event: React.ChangeEvent<HTMLSelectElement>) => {
    if(event.target.value === 'Paragraph') {
      document.execCommand('insertParagraph', false, event.target.value);
    }else {
      document.execCommand('formatBlock', false, event.target.value);
    }
  };

  const handleEditable = (e: any) => setWordList(e.currentTarget.textContent.length);

  const handleFont = (event: React.ChangeEvent<HTMLSelectElement>) => {
    document.execCommand('fontName', false, event.target.value.toLowerCase());
  };

  const AddImage = () => (
    <div className="modal-content">
    <span className="close" onClick={handleCloseModal}>&times;</span>
    <p className="app__title">Embed</p>
    <p className="app__upload-img">Upload image</p>
    <p className="app__upload">File upload</p>
    <div className="app__image">
      {
        !selectedFile && (
          <>
            <input type="file" id="upload" hidden onChange={onSelectFile} />
            <label htmlFor="upload">Import image from device</label>
          </>
        )
      }
      {selectedFile &&  
        <div className="app__preview-image">
          <img src={preview} alt="user selection" /> 
        </div>
    }
    </div>
    <div>
      <button 
        className="app__add-image" 
        onClick={handleEmbeImage}
      >
        Embed
      </button>
      <button className="app__add-cancel" 
        onClick={handleCloseModal}
      >Cancel</button>
    </div>
    </div>
  );

  const AddVideo = () => (
    <div className="modal-content">
      <span className="close" onClick={handleCloseModal}>&times;</span>
      <p className="app__title">Embed</p>
      <p className="app__upload">VIDEO PROVIDER</p>
      {
        !selectedFile &&  (
          <div className="app__others">
          <label className='app__label'>Video Provider</label>
          <select 
            name="Color"
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setVideoType(e.target.value)}
            className="app__edit-select"
            style={{ fontSize: '15px' }}
            value={videoType}
          >
            <option value="youtube">Youtube</option>
            <option value="video url">Video URL</option>
            <option value="device">Your Device</option>
          </select>
          {
            videoType === 'device' 
            ? (
              <div className="app__image">
              {
                !selectedFile && (
                  <>
                    <input type="file" id="upload" hidden onChange={onSelectFile} />
                    <label htmlFor="upload">Import video from device</label>
                  </>
                )
              }
            </div>
            ) : 
            (
              <>
                <label className='app__label'>{videoType ? 'CODE' : 'URL'}</label>
                <input 
                  type="text"
                  value={code} 
                  onChange={handleCode}
                  className="app__input"
                  autoFocus
                />
              </>
            )
          }
          </div>
        )
      }
      {selectedFile &&  
        <div className="app__preview-video">
          <video width="400" controls>
              <source src={preview} type="video/mp4" />
              Your browser does not support HTML video.
          </video>
        </div>
      }
      <div>
        <button 
          className="app__add-image" 
          onClick={handleVideo}
        >
          Embed
        </button>
        <button className="app__add-cancel" 
          onClick={handleCloseModal}
        >Cancel</button>
      </div>
    </div>
  );

  const Social = () => (
    <div className="modal-content">
    <span className="close" onClick={handleCloseModal}>&times;</span>
    <p className="app__title">Embed</p>
    <div className="app__others">
      <label className='app__label' style={{ textTransform: 'uppercase'}}>Social Media platform</label>
      <select 
        name="Social"
        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setLinkTitle(e.target.value)}
        className="app__edit-select"
        style={{ fontSize: '15px', backgroundColor: '#FEFEFE' }}
        value={linkTitle}
        >
          <option>Facebook</option>
          <option>Instagram</option>
          <option>Twitter</option>
          <option>Others</option>
      </select>
      <label className='app__label'>URL</label>
      <input 
        type="text"
        value={url} 
        onChange={handleUrlInput}
        className="app__input"
        autoFocus
      />
    </div>
    <div>
      <button 
        className="app__add-image" 
        onClick={handleEmbeSocial}
      >
        Embed
      </button>
      <button className="app__add-cancel" 
        onClick={handleCloseModal}
      >
        Cancel
    </button>
    </div>
    </div>
  );

  const dropdownOption: {[key: string]: React.ReactNode} = {
    image: <AddImage />,
    video: <AddVideo />,
    social: <Social />
  };

  const FontDropdown = () => (
    <select 
      name="Font Size"
      onChange={handleFontSize}
      value={changeValue} 
      className="app__edit-select"
    >
      <option>1</option>
      <option>2</option>
      <option>3</option>
      <option>4</option>
      <option>5</option>
      <option>6</option>
      <option>7</option>
    </select>
  );

  const ColorDropdown = () => (
    <select 
      name="Color"
      onChange={handleColor}
      className="app__edit-select"
    >
      <option value="#000000">Black</option>
      <option value="#008080">Teal</option>
      <option value="#C0C0C0">Silver</option>
      <option value="#800000">Maroon</option>
      <option value="#FF0000">Red</option>
      <option value="#800080">Purple</option>
      <option value="#008000">Green</option>
      <option value="#FFFF00">Yellow</option>
    </select>
  );

  const HeadingDropdown = () => (
    <select 
      name="Heading"
      onChange={handleHeading}
      className="app__edit-select"
    >      
      <option value="paragraph">Paragraph</option>
      <option value="h6">Heading 6</option>
      <option value="h5">Heading 5</option>
      <option value="h4">Heading 4</option>
      <option value="h3">Heading 3</option>
      <option value="h2">Heading 2</option>
      <option value="h1">Heading 1</option>
    </select>
  );

  const HeadingFont = () => (
    <select 
      name="Font"
      onChange={handleFont}
      className="app__edit-select"
    >      
      <option>Arial</option>
      <option>Verdana</option>
      <option>Tahoma</option>
      <option>Trebuchet MS</option>
      <option>Times New Roman</option>
      <option>Georgia</option>
      <option>Garamond</option>
      <option>Courier New</option>
      <option>Brush Script MT</option>
    </select>
  );


  return (
    <div className='app'>
      {
        showPost && (
          <div className="app__container">
            <span className="close" onClick={() => setShowPost(false)}>&times;</span>
            <p className="app__title-top">{titlePost}</p>
            <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
          </div>
        )
      }
      <div className="app__container">
        <div 
          contentEditable="true" 
          className="app__title-top"
          onInput={(e: any) => setTitlePost(e.currentTarget.textContent)}
        >
            Add a Title
        </div>
        <div className="app__button-container">
          <HeadingDropdown />
          <EditButton cmd="italic" Icon={ItalicSVG} />
          <EditButton cmd="bold" Icon={BoldSVG} />
          <EditButton cmd="justifyLeft" Icon={AlignLeft} />
          <EditButton cmd="justifyCenter" Icon={CenterSvg} />
          <EditButton cmd="justifyRight" Icon={Right} />
          <EditButton cmd="insertOrderedList" Icon={List} />
          <EditButton cmd="insertUnorderedList" Icon={List} />
          <EditButton cmd="justify" Icon={Justify} />
          <EditButton cmd="fontName" name="Font" arg="arial" />
          <EditButton cmd="insertHorizontalRule" name="L" />
          <FontDropdown />
          <ColorDropdown />
          <EditButton cmd="underline" Icon={Underline} />
          <HeadingFont />
        </div>
          <div>
            <div
              className="app__content-edit"
              contentEditable={contentEditable}
              id="editable"
              ref={ref}
              dangerouslySetInnerHTML={{ __html: html }}
              onInput={handleEditable}
            />
            <button onClick={() => setOpenDropdown(!openDropdown)} className="app__button">
              <OpenSVG />
            </button>
            {
              openDropdown && (
                <div className="app__dropdown">
                <p className="app__emb">embeds</p>
                <ul>
                  <li onClick={() => { setCurrentDropdown('image'); setModal(true) }}>
                    <ImageSVG/>
                    <span className="app__dropdown-content">
                      <p className="app__title">Picture</p>
                      <p className="app__sub-title">Jpeg,Png</p>
                    </span>
                  </li>
                  <li onClick={() => { setCurrentDropdown('video'); setModal(true) }}>
                    <PicSVG/>
                    <span className="app__dropdown-content">
                      <p className="app__title">Video</p>
                      <p className="app__sub-title">Embed a Youtube video</p>
                    </span>
                  </li>
                  <li onClick={() => { setCurrentDropdown('social'); setModal(true) }}>
                    <ImageSVG/>
                    <span className="app__dropdown-content">
                      <p className="app__title">Social</p>
                      <p className="app__sub-title">Enbed a Facebook link</p>
                    </span>
                  </li>
                </ul>
              </div>
              )
            }
            <div 
              id="myModal" 
              className="modal" 
              style={{ display: modal ? 'block' : 'none' }}
            >
              {dropdownOption[currentDropdown]}
            </div>
          </div>
        </div>
        <div className="app__words">
            <p>{wordList}/1000 words</p>
          </div>
        <div className="app__post">
          <button 
            className="app__add-image" 
            onClick={handlePost}
            disabled={wordList === 0}
          >
            Post
          </button>
        </div>
    </div>
  );
}

export default App;
