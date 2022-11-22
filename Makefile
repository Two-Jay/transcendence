all:
	@echo "make         < This is 'what you done just now'"
	@echo "make .       < Create local volume folder and build image"
	@echo "make all     < This will do a 'make .'"
	@echo "make up      < This depends on the image, not the build"
	@echo "make build   < This is equivalent  'make .'"
	@echo "make down    < Quit docker and do not delete images"
	@echo "make re      < This is equivalent  'make clean' and 'make build'"
	@echo "make clean   < This will do a 'make down' and further action is to remove all images"
	@echo "make fclean  < This will do a 'make clean' and further work is to prune the docker systems, remove the postgres volume and local volume folder. But maybe.. you need to restart Docker Hub."
	@echo ""
	@echo "If you want to get  the resule of legacy (like 'make'), Do 'make .' or 'make build'"

.: build

build:
	docker-compose -f srcs/docker-compose.yml up --build -d

up:
	docker-compose -f srcs/docker-compose.yml up -d

down:
	docker-compose -f srcs/docker-compose.yml down

re: clean build

clean: down
	docker rmi -f $$(docker images -q)

fclean: clean
	docker system prune -f
	docker volume prune -f

.PHONY: all . build up down re clean fclean
