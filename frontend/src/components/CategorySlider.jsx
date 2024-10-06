import { Button } from "./ui/button";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "./ui/carousel"

const category =[
  "Frontend Developer",
  "Backend Developer",
  "Web Developer",
  "Mobile Developer",
  "Data Scientist",
  "Product Manager",
  "UX/UI Designer",
  "QA/Tester",
]
const CategorySlider = () => {
  return (
    <div>
      <Carousel className="w-full max-w-xl mx-auto my-20">
        <CarouselContent>
          {category.map((item, index) => (
            <CarouselItem
              key={index}
              className="flex justify-center items-center gap-4 md:basis-1/2 lg-basis-1/3"
            >
              <Button variant="outline" className="rounded-full" >{item}</Button>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  );
}

export default CategorySlider