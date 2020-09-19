import React, {
  useEffect,
  useState,
  useRef
} from 'react'
import './stage.scss'
import films from './film-data.json'
console.log('films', films)

const Stage = props => {
  const containerRef = useRef(null)
  const sceneRef = useRef(null)

  // const onScrollHandler = useCallback(e => {
  //   console.log('scrolling! sceneRef.current', sceneRef.current, e)
  //   if (!sceneRef.current) return
  // }, [])

  // const onMouseMove = useCallback(e => {
  //   console.log('mouse move', e)
  // }, [])

  // const [scrollPosition, setSrollPosition] = useState(0)
  const handleScroll = e => {
    console.log('handle scroll...', containerRef.current.scrollTop)
    // const position = window.pageYOffset
    // setSrollPosition(position)
    sceneRef.current.style.setProperty("--cameraZ", containerRef.current.scrollTop);
  }

  useEffect(() => {
    // setSceneHeight
    const numberOfItems = films.length; // Or number of items you have in `.scene3D`
    const itemZ = parseFloat(
      getComputedStyle(sceneRef.current).getPropertyValue("--itemZ")
    )
    const scenePerspective = parseFloat(
      getComputedStyle(sceneRef.current).getPropertyValue(
        "--scenePerspective"
      )
    );
    const cameraSpeed = parseFloat(
      getComputedStyle(sceneRef.current).getPropertyValue("--cameraSpeed")
    );

    const height =
      window.innerHeight +
      scenePerspective * cameraSpeed +
      itemZ * cameraSpeed * numberOfItems;

    // Update --viewportHeight value
    containerRef.current.style.setProperty("--viewportHeight", height);

    // sceneRef.current.addEventListener('scroll', handleScroll, { passive: true });
    // console.log('added scroll listener', sceneRef.current)
    // const elementWithScrollListener = sceneRef.current

    // return () => {
    //   elementWithScrollListener.removeEventListener('scroll', handleScroll);
    // }
  }, [])

  return (
    <div className='stage' ref={containerRef} onScroll={handleScroll}>
      <div className='viewport'>
        <div className='scene3D-container'>
          <div className='scene3D' ref={sceneRef}>
            {films.map((film, index) => (
              <div key={`film-${index}`}>
                <h2>{film.title}</h2>
                <p>Year: {film.release_date}</p>
                <p>Director: {film.director}</p>
                <p>{film.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Stage
