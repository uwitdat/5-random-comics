import React from 'react';
import styles from '../styles/comics.module.scss';
import { Comic } from 'pages';
import Image from 'next/image';
import Link from 'next/link';

const Comics = ({ comics }: { comics: Comic[] }) => {
  if (!comics) return <p>Loading...</p>;

  return (
    <div className={styles.container}>
      <h1>5 Random Marvel Comics W/ NextJS & Marvel API</h1>
      <ul className={styles.comics}>
        {comics.map((comic) => (
          <li className={styles.comic} key={comic.id}>
            <h2>{comic.title}</h2>
            <Image
              src={`${comic.sprite.path}.${comic.sprite.extension}`}
              alt="comic img"
              width={300}
              height={300}
            />
            <Link href={`/comics/${comic.id}`}>
              <button>View More</button>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Comics;
