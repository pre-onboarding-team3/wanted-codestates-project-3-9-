import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import { AiFillHeart, AiOutlineHeart } from 'react-icons/ai';
import { toggleLikeButton } from '../../redux/actions';
import Grade from '../Grade';
import Comment from '../Comment';
import { data } from '../../model/data';

const List = ({ dataList }) => {
  const dispatch = useDispatch();
  const [target, setTarget] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);

  const clickLikeBtn = id => {
    dispatch(toggleLikeButton(id));
  };

  const getStarfromRate = reviewRate => {
    let initClicked = [false, false, false, false, false];
    for (let i = 0; i < reviewRate; i++) {
      initClicked[i] = true;
    }
    return initClicked;
  };

  const addItems = () => {
    if (dataList.length === data.length) {
      alert('더 이상 불러올 데이터가 없습니다.');
      setIsLoaded(false);
      return;
    }
    setIsLoaded(true);
    // setDataList(data.slice(0, );
    setIsLoaded(false);
  };

  const onIntersect = ([entry], observer) => {
    if (entry.isIntersecting && !isLoaded) {
      console.log('check', entry.isIntersecting);
      observer.unobserve(entry.target);
      addItems();
      observer.observe(entry.target);
    }
  };

  useEffect(() => {
    let observer;
    const defaultOption = {
      root: null,
      threshold: 0.5,
      rootMargin: '0px'
    };
    if (target) {
      observer = new IntersectionObserver(onIntersect, defaultOption);
      observer.observe(target);
    }
    return () => observer && observer.disconnect();
  }, [target]);

  return (
    <Wrapper>
      {dataList.map(item => {
        const {
          id,
          productNm,
          productImg,
          reviewRate,
          likeCnt,
          review,
          isClicked,
        } = item;
        return (
          <ContentsContainer key={id}>
            <img src={`${productImg}`} />
            <InfoContainer>
              <LabelWrapper>
                <span onClick={() => clickLikeBtn(id)}>
                  {isClicked ? (
                    <AiFillHeart color="red" size={18} />
                  ) : (
                    <AiOutlineHeart size={18} />
                  )}
                  {likeCnt}
                </span>
              </LabelWrapper>
              <LabelWrapper>
                <Grade clicked={getStarfromRate(reviewRate)} size={15} />
              </LabelWrapper>
              <LabelWrapper>
                <h2>{productNm}</h2>
              </LabelWrapper>
              <br />
              <LabelWrapper>
                <span>{review}</span>
              </LabelWrapper>
              <br />
            </InfoContainer>
            <Comment />
            <div ref={setTarget} />
          </ContentsContainer>
        );
      })}
    </Wrapper>
  );
};

const Wrapper = styled.div`
  width: 500px;
  overflow-y: scroll;
`;

const ContentsContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const LabelWrapper = styled.div`
  display: flex;
`;

const InfoContainer = styled.div`
  width: 100%;
  padding: 16px;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

List.propTypes = {
  dataList: PropTypes.array,
};

export default List;
