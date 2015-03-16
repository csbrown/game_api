from django.shortcuts import render
from django.http import JsonResponse as JR
import json
import gamebrain.tictactoe.ai as ai
import pkg_resources
from rest_framework.renderers import JSONRenderer
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.decorators import api_view, renderer_classes
import pdb

def json_error(message):
	return {"error" : str(message)}

def json_help(available_engine_list, request_format):
	return {"available_engines" : available_engine_list,
		"request_format" : request_format}

class Engine(object):
	'''This class is designed to specify a game engine, while postponing deployment of it'''
	def __init__(self, engine_class, *args, **kwargs):
		self.engine_class = engine_class
		self.args = args
		self.kwargs = kwargs
	def spinup(self):
		return self.engine_class(*self.args, **self.kwargs)

get_brainfile = lambda x: pkg_resources.resource_filename("gamebrain.tictactoe", "data/" + x)
tictactoe_engines = {
	"tictactoe_neuralnet_1" : Engine(ai.TTTNNAI, filename = get_brainfile("brain1.xml")),
	"tictactoe_neuralnet_2" : Engine(ai.TTTNNAI, filename = get_brainfile('brain2.xml')),
	"tictactoe_neuralnet_3" : Engine(ai.TTTNNAI, filename = get_brainfile('brain3.xml')),
	"tictactoe_logicai_hard" : Engine(ai.TTTPerfectAI),
	"tictactoe_logicai_medium" : Engine(ai.TTTMediumAI),
	"tictactoe_logicai_easy" : Engine(ai.TTTEasyAI)
	}
 
tictactoe_request_format = { "engine" : "tictactoe_logicai_hard",
		              "state" : { "board" : [1,0,1,-1,-1,0,0,0,0],
					  "player": 1 }
                            } 

def _game_api(available_engines, request_format, request):
	# Load the json request body
	try:
		game = json.loads(request.body)
	except:
		return json_error("can't parse your json request")

	if "help" in game:
		return json_help(available_engines.keys(), request_format)
		
	try:
		game_engine_name = game["engine"]
		game_state = game["state"]
	except:
		return json_error("must provide a game engine and game state")

	if game_engine_name not in available_engines:
		return json_error("no such engine")

	try:
		game_engine = available_engines[game_engine_name].spinup()
	except:
		return json_error("unable to spin up given engine... contact webmaster")

	try:
		# TODO: fix game engine to be this way: return game_engine(**game_state)
		from gamebrain.tictactoe.tttengine import TTTBoard as Board
		game_board = Board()
		game_board.board = game_state["board"]
		game_player = game_state["player"]
		play = game_engine.get_play(game_board, game_player)
		return {"play" : play}	
	except:
		return json_error("given engine does not understand given state.  If you are sure you have the correct format, contact webmaster")

@api_view(['POST'])
@renderer_classes((JSONRenderer,))
def tictactoe(request):
	return Response(_game_api(tictactoe_engines, tictactoe_request_format, request))	

@api_view(['GET', 'POST'])
@renderer_classes((JSONRenderer,))
def index(request):
	return Response({ "hello" : "world!" })
