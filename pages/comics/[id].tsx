import React, { useState } from 'react';
import { GetServerSideProps } from 'next/types';
import md5 from 'md5';
import styles from '../../styles/comic.module.scss';
import Image from 'next/image';
import Link from 'next/link';

interface Comic {
  id: number;
  title: string;
  sprite: { path: string; extension: string };
  price: number;
  desc: string;
}

interface Comment {
  id: number;
  comment: string;
  commentedBy: string;
  comicId: number;
}

interface ServerData {
  comic: Comic;
  comments: Comment[];
}
export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id } = context.params;

  const ts = Math.floor(Date.now() / 1000);
  const hash = md5(ts + process.env.PRIVATE_KEY + process.env.PUBLIC_KEY);

  let comicJson;
  let commentsJson;

  try {
    const [comic, comments] = await Promise.all([
      fetch(
        `https://gateway.marvel.com:443/v1/public/comics/${id}?ts=${ts}&apikey=${process.env.PUBLIC_KEY}&hash=${hash}`
      ),
      fetch(`${process.env.URI}/api/comments/${id}`),
    ]);

    [comicJson, commentsJson] = await Promise.all([
      await comic.json(),
      await comments.json(),
    ]);
  } catch (err) {
    console.log(err.message);
  }

  return {
    props: {
      data: {
        comic: comicJson.data.results.map((c) => {
          return {
            id: c.id,
            title: c.title,
            desc: c.description,
            sprite: c.thumbnail,
            price: c.prices[0].price,
          };
        }),
        comments: commentsJson,
      },
    },
  };
};

const Meme = ({ data }: { data: ServerData }) => {
  const { comic, comments } = data;
  const [commentsData, setCommentsData] = useState(comments);
  const { title, price, sprite, desc, id } = comic[0];

  const initialValues = {
    comicId: id,
    comment: '',
    commentedBy: '',
  };

  const [comment, setComment] = useState(initialValues);

  const handleSetValues = (e) => {
    const { value, name } = e.target;

    setComment({
      ...comment,
      [name]: value,
    });
  };

  const handleAddComment = async () => {
    try {
      const res = await fetch('/api/new-comment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(comment),
      });
      if (res.status === 200) {
        const newComment = await res.json();
        setComment(initialValues);
        setCommentsData([newComment, ...commentsData]);
      }
    } catch (err) {
      console.log(err.message);
    }
  };

  return (
    <div className={styles.container}>
      <Link href="/">
        <button className={styles.button}>Back</button>
      </Link>
      <section className={styles.comic}>
        <h1>{title}</h1>
        <h3>${price}</h3>
        <Image
          src={`${sprite.path}.${sprite.extension}`}
          alt="comic img"
          width={400}
          height={400}
        />
        <p>{desc}</p>
      </section>
      <h2>Comments:</h2>
      {!commentsData.length ? (
        <h2>No Comments.</h2>
      ) : (
        <section className={styles.commentsContainer}>
          {commentsData.map(({ comment, commentedBy, id }) => (
            <div className={styles.comment} key={id}>
              <h3>{comment}</h3>
              <p>by: {commentedBy}</p>
            </div>
          ))}
        </section>
      )}
      <h2>Add a comment</h2>
      <div className={styles.commentForm}>
        <input
          placeholder="Comment"
          value={comment.comment}
          name="comment"
          onChange={(e) => handleSetValues(e)}
          required
        />
        <input
          placeholder="Choose an alias"
          value={comment.commentedBy}
          name="commentedBy"
          onChange={(e) => handleSetValues(e)}
          required
        />
        <button onClick={handleAddComment}>Submit</button>
      </div>
    </div>
  );
};
export default Meme;
