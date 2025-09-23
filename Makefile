export STAGE=dev

FRONT=frontend
FRONT_STAGE=frontend/$(STAGE)
ENV=$(STAGE)

run-dev-web-app:
ifeq ($(shell [ -e .env ] && echo 1 || echo 0 ), 1)
	rm .env	
endif
	ln .env.local.$(ENV) .env
	yarn quasar dev
build-prod-web-app:
ifeq ($(shell [ -e $(FRONT) ] && echo 1 || echo 0 ), 0)
	mkdir $(FRONT)
endif
ifeq ($(shell [ -e $(FRONT_STAGE) ] && echo 1 || echo 0 ), 0)
	mkdir $(FRONT_STAGE)
endif
ifeq ($(shell [ -e .env.local.$(ENV) ] && echo 1 || echo 0 ), 0)
	$(error error .env.local.$(ENV) does not exist)
endif
ifeq ($(shell [ -e .env ] && echo 1 || echo 0 ), 1)
	rm .env	
endif
	ln .env.local.$(ENV) .env	
	quasar build
	cd $(FRONT_STAGE) && touch emptyFile && cd ..
	rm -r $(FRONT_STAGE)/*
	cp -r dist/spa/* $(FRONT_STAGE)
run-prod-web-app:
	quasar serve dist/spa
test:
	@echo $(shell [ -e .env ] && echo 1 || echo 0 )

