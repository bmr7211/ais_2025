// /Users/shinji81/my-app/src/App.js
import React, { useState, useEffect, useCallback } from 'react';

function App() {
  const [selectedKeywords, setSelectedKeywords] = useState([]);
  const [contentImages, setContentImages] = useState([]);
  //const [keywordNames, setKeywordNames] = useState({});
  const [keywordMap, setKeywordMap] = useState({});

  useEffect(() => {
    const fetchKeywords = async () => {
      console.log('키워드 요청 보내는 중...');
      try {
        const response = await fetch('http://localhost:3001/api/keywords');
        if (!response.ok) throw new Error('키워드를 가져오는데 실패했습니다.');
        const data = await response.json();

        const map = {};
        data.forEach((keyword) => {
          map[keyword.keywords_id] = keyword.keywords_name;
        });

        setKeywordMap(map);
      } catch (error) {
        console.error(error);
      }
    };

    fetchKeywords();
  }, []);

  // 키워드 선택/해제
  const handleButtonClick = (id) => {
    setSelectedKeywords((prev) =>
      prev.includes(id) ? prev.filter((k) => k !== id) : [...prev, id]
    );
  };

  // 콘텐츠 요청
  const fetchContentImages = useCallback(async () => {
    if (selectedKeywords.length === 0) {
      setContentImages([]);
      return;
    }

    // `keywords_id` --> `keywords_name` 변환
    const keywordNames = selectedKeywords.map((id) => keywordMap[id]).filter(Boolean);
    console.log('서버에 전달할 키워드:', keywordNames);

    try {
      const response = await fetch('http://localhost:3001/api/contents', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ keywords: keywordNames }),
      });

      if (!response.ok) throw new Error('데이터를 가져오는데 실패했습니다.');
      const data = await response.json();
      setContentImages(data);
    } catch (error) {
      console.error(error);
      setContentImages([]);
    }
  }, [selectedKeywords, keywordMap]);

  // 선택된 키워드가 변경될 때마다 fetch 실행
  useEffect(() => {
    fetchContentImages();
  }, [fetchContentImages]);

  // 선택 해제 버튼
  const handleClearSelection = () => {
    setSelectedKeywords([]);
    setContentImages([]);
  };

  return (
    <div>
      <h1>Keyword Selector</h1>
      <div>
        {Object.keys(keywordMap).map((id) => (
          <button
            key={id}
            onClick={() => handleButtonClick(id)}
            style={{
              backgroundColor: selectedKeywords.includes(id) ? 'red' : 'white',
            }}
          >
            {keywordMap[id]}
          </button>
        ))}
      </div>

      <button onClick={handleClearSelection}>선택 해제</button>

      <h2>선택된 키워드:</h2>
      <p>
        {selectedKeywords.length > 0
          ? selectedKeywords.map((id) => keywordMap[id]).join(', ')
          : '선택된 키워드가 없습니다.'}
      </p>

      <h3>콘텐츠 이미지:</h3>
      <div>
        {contentImages.length > 0 ? (
          contentImages.map((content, index) => (
            <div key={index}>
              <img
                src={`http://localhost:3001/${content.contents_poster}`} // 이미지 절대 경로 수정
                alt={content.contents_name}
                width="200"
                height="300"
              />
              <p>{content.contents_name}</p>
            </div>
          ))
        ) : (
          <p>선택된 키워드에 해당하는 콘텐츠가 없습니다.</p>
        )}
      </div>
    </div>
  );
}

export default App;
